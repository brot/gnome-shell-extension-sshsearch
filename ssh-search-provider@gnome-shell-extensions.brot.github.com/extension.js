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
const Lang = imports.lang;
const Shell = imports.gi.Shell;
const Util = imports.misc.util;

// Settings
const SSHSEARCH_TERMINAL_APP = 'gnome-terminal';
const HOST_SEARCHSTRING = 'host ';

// sshSearchProvider holds the instance of the search provider
// implementation. If null, the extension is either uninitialized
// or has been disabled via disable().
var sshSearchProvider = null;

function SshSearchProvider() {
    this._init();
}

SshSearchProvider.prototype = {
    __proto__: Search.SearchProvider.prototype,

    _init: function(name) {
        Search.SearchProvider.prototype._init.call(this, "SSH");
        this._hostnames = [];
        this._configFile = Gio.file_new_for_path(GLib.build_filenamev([GLib.get_home_dir(), '/.ssh/', 'config']));

        // add file-monitor the the ssh-config file        
        this._monitor = this._configFile.monitor_file(Gio.FileMonitorFlags.NONE, null);
        this._monitor.connect('changed', Lang.bind(this, this._onConfigChanged));
        
        // read ssh-config file when initializing this extension
        this._onConfigChanged(null, this._configFile, null, Gio.FileMonitorEvent.CREATED);
    },
    
    _onConfigChanged : function(filemonitor, file, other_file, event_type) {
        this._hostnames = [];
        if (event_type == Gio.FileMonitorEvent.CREATED ||
            event_type == Gio.FileMonitorEvent.CHANGED ||
            event_type == Gio.FileMonitorEvent.CHANGES_DONE_HINT)
        {
            // read hostnames if ssh-config file is created or changed
            let content = file.load_contents(null);
            let filelines = String(content[1]).split('\n')
            
            // search for all lines which begins with "host"
            for (var i=0; i<filelines.length; i++) {   
                let line = filelines[i].toLowerCase();
                if (line.match(HOST_SEARCHSTRING)) {                
                    // read all hostnames in the host definition line
                    let hostnames = line.slice(HOST_SEARCHSTRING.length).split(' ');
                    for (var j=0; j<hostnames.length; j++) {
                        this._hostnames.push(hostnames[j]);
                    }
                }
            }
        }
    },

    getResultMeta: function(resultId) {
        let appSys = Shell.AppSystem.get_default();
        let app = appSys.lookup_app(SSHSEARCH_TERMINAL_APP + '.desktop');
        return { 'id': resultId,
                 'name': resultId.host,
                 'createIcon': function(size) {
                                   return app.create_icon_texture(size);
                               }
               };
    },

    activateResult: function(id) {
        Util.spawn([SSHSEARCH_TERMINAL_APP, '-e', 'ssh ' + id.host]);
    },

    getInitialResultSet: function(terms) {
        // check if a found host-name begins like the search-term        
        let searchResults = [];
        for (var i=0; i<this._hostnames.length; i++) {
            for (var j=0; j<terms.length; j++) {
                try {
                    if (this._hostnames[i].match(terms[j])) {
                        searchResults.push({
                            'host': this._hostnames[i]
                        });
                    }
                }
                catch(ex) {
                    continue;
                }
            }
        }
        
        if (searchResults.length > 0) {
            return(searchResults);
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
