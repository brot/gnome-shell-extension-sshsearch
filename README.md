Ssh Search Provider
=====================
A gnome-shell extension which searches the ssh config file and
provides the found ssh connections in your shell overview.

So you need a ~/.ssh/config file to use this extensions. It parses
the config file and search for the strings after the "Host" setting.

### Installation
* ./autogen.sh --prefix=/usr/local && make && sudo make install
  * Make sure you have the following packages installed:
    * gnome-common
    * intltool
    * glib2-devel (Fedora), libglib2.0-dev (Ubuntu)
* enable extension (e.g. via gnome-tweak-tool)

### Selecting Your preferred Terminal Application
By default, this extension will use gnome-terminal as the terminal application. To change
the terminal application (e.g. Terminator), use gsettings:

    gsettings set com.github.brot.sshsearch terminal-app terminator

or

    gsettings set com.github.brot.sshsearch terminal-app gnome-terminal

To see which note application is currently configured:

    gsettings get com.github.brot.sshsearch terminal-app


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
