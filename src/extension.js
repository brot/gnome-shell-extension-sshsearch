/* Ssh Search Provider for Gnome Shell
 *
 * Copyright (c) 2011 Bernd Schlapsi
 *
 * This programm is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This programm is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
const Main = imports.ui.main;
const Search = imports.ui.search;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Shell = imports.gi.Shell;
const Util = imports.misc.util;
const Gettext = imports.gettext.domain('gnome-shell-extension-sshsearch');
const _ = Gettext.gettext;

// Settings
const SSHSEARCH_SETTINGS_SCHEMA = 'com.github.brot.sshsearch';
const SSHSEARCH_TERMINAL_APP_KEY = 'terminal-app';

// sshSearchProvider holds the instance of the search provider
// implementation. If null, the extension is either uninitialized
// or has been disabled via disable().
var sshSearchProvider = null;

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

function getSettings(schema) {
    if (Gio.Settings.list_schemas().indexOf(schema) == -1)
        throw _("Schema \"%s\" not found.").format(schema);
    return new Gio.Settings({ schema: schema });
}

function SshSearchProvider() {
    this._init();
}

SshSearchProvider.prototype = {
    __proto__: Search.SearchProvider.prototype,

    _init: function(name) {
        Search.SearchProvider.prototype._init.call(this, "SSH");
        this._configFile = GLib.build_filenamev([GLib.get_home_dir(), '/.ssh/', 'config']);
        
        this._settings = getSettings(SSHSEARCH_SETTINGS_SCHEMA);
        this._terminal_app = this._settings.get_string(SSHSEARCH_TERMINAL_APP_KEY).toLowerCase();
    },

    getResultMeta: function(resultId) {
        let appSys = Shell.AppSystem.get_default();
        let app = appSys.lookup_app(this._terminal_app + '.desktop');
        return { 'id': resultId,
                 'name': resultId.host,
                 'createIcon': function(size) {
                                   return app.create_icon_texture(size);
                               }
               };
    },

    activateResult: function(id) {
        Util.spawnCommandLine(this._terminal_app + ' -e "ssh ' + id.host + '"');
    },

    getInitialResultSet: function(terms) {
        if (GLib.file_test(this._configFile, GLib.FileTest.EXISTS)) {

            let filedata = GLib.file_get_contents(this._configFile, null, 0);
            let filelines = String(filedata[1]).split('\n')
            
            let names = [];
            let searchstring = 'Host ';
            
            for (var i=0; i<filelines.length; i++) {
               if (filelines[i].startsWith(searchstring)) {
                    names.push(filelines[i].slice(searchstring.length));
               }
            }
                        
            let searchResults = [];
            for (var i=0; i<names.length; i++) {
                for (var j=0; j<terms.length; j++) {
                    if (names[i].startsWith(terms[j])) {
                        searchResults.push({
                                    'host': names[i]
                        });
                    }
                }
            }
            
            if (searchResults.length > 0) {
                return(searchResults);
            }
        }
        
        return []
    },

    getSubsearchResultSet: function(previousResults, terms) {
        return this.getInitialResultSet(terms);
    },
};

function init(meta) {
}   

function enable() {
    if (sshSearchProvider==null) {
        sshSearchProvider = new SshSearchProvider();
        Main.overview.addSearchProvider(sshSearchProvider);
    }
}

function disable() {
    if  (sshSearchProvider!=null) {
        Main.overview.removeSearchProvider(sshSearchProvider);
        sshSearchProvider = null;
    }
}
