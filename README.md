Ssh Search Provider
=====================
A gnome-shell extension which searches the ssh config file and
provides the found ssh connections in your shell overview.

So you need a ~/.ssh/config file to use this extensions. It parses
the config file and search for the strings after the "Host" setting.

### Installation
* copy or link the folder "ssh-search-provider@gnome-shell-extensions.brot.github.com" to ~/.local/share/gnome-shell/extensions
* enable extension (e.g. via gnome-tweak-tool)

### Selecting Your preferred Terminal Application
At the moment it isn't possible to configure the preferred terminal app directly.
The reason is that gnome-shell in the current stable version (3.2) don't provide
tools for extensions to create extension specific settings. 
With the future version of gnome-shell (3.4) this should be possible and then I 
will provide an updated version of this extension with some gsetting options.

At the moment you could only change the source code directly. So you have to 
change the file ~/.local/share/gnome-shell/extensions/ssh-search-provider@gnome-shell-extensions.brot.github.com/extension.js

Replace 'gnome-terminal' with the name of your preferred terminal app:

    const SSHSEARCH_TERMINAL_APP = 'gnome-terminal';
    
For example

    const SSHSEARCH_TERMINAL_APP = 'terminator';


### License
Copyright (c) 2011 Bernd Schlapsi <brot@gmx.info>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
