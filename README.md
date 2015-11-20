Raccoon
=======

Main repository for Raccoon


Requirements
------------
1. Install [python3](https://www.python.org/downloads/release/python-350/)
2. Install pip3:
  - [Install on OsX](http://stackoverflow.com/questions/20082935/how-to-install-pip-for-python3-on-mac-os-x)
3. Install virtualenv with python3
  - Run `$ python --version` it should return `$ Python 3.5.0`
  - Run `$ pip3 install virtualenv`

Virtual environment
-------------------
Create virtual environment. Run:
```bash
$ virtualenv venv
```
Add ```PYTHONPATH``` to yourenv/bin/activate
```bash
export PYTHONPATH=$PYTHONPATH:"path-to-raccoon-repo/src"
```

Activate virtual environment. Run:
```bash
$ source venv/bin/activate
```
If you want to deactivate virtual environment. Run:
```bash
$ deactivate
```

Install
-------
After virtual environment activation. Run:
```bash
pip install -r requirements.txt
cd web && npm install
```

Start server with ```npm start```
