#!/bin/bash

# setting vars
PATH_VENV=/opt/venv
PATH_RACCOON=/opt/raccoon
PATH_SRC=${PATH_RACCOON}/src
PATH_WEB=${PATH_RACCOON}/web
export LC_ALL=C

# redirect all output to /tmp/bootstrap.log
&>/tmp/bootstrap.log

# initial setup
sudo apt-get --yes --allow-change-held-packages install python3 python3-pip mongodb npm

pip3 install virtualenv

sudo mkdir ${PATH_VENV}
sudo chown ubuntu ${PATH_VENV}

# create virtual env
virtualenv ${PATH_VENV}

# setup virtual env
echo "export PYTHONPATH=\$PYTHONPATH:${PATH_SRC}">>${PATH_VENV}/bin/activate
ln -s ${PATH_RACCOON}/sys/bin/raccoon ${PATH_VENV}/bin/raccoon
ln -s ${PATH_RACCOON}/sys/bin/raccoonshell ${PATH_VENV}/bin/raccoonshell

source ${PATH_VENV}/bin/activate

# setup project
cd ${PATH_RACCOON}
pip install -r requirements.txt
cd ${PATH_WEB}
npm install
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo npm install -g watchify
sudo npm install -g browserify

# start raccoon
npm start

