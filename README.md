Raccoon
=======

Main repository for Raccoon


Requirements
------------
1. Install [python3](https://www.python.org/downloads/release/python-350/)
2. Install pip3:
  - [Install on OSX](http://stackoverflow.com/questions/20082935/how-to-install-pip-for-python3-on-mac-os-x)
3. Install virtualenv with python3
  - Run `$ python --version` it should return `$ Python 3.5.0`
  - Run `$ pip3 install virtualenv`
4. Install mongodb
  - Linux: run `$ sudo apt-get install mongodb`

Virtual environment
-------------------
Create virtual environment. Run:
```bash
$ virtualenv venv
```
Add ```PYTHONPATH``` to path-to-your-env/bin/activate
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

Add executables files to where they belong:
```
ln -s path-to-raccoon-repo/sys/bin/raccoon path-to-your-env/bin/raccoon
ln -s path-to-raccoon-repo/sys/bin/raccoonshell path-to-your-env/bin/raccoonshell
```

Running
-------
Start server with:
```
npm start
```

Run celery with:
```
celery -A raccoon.tasks.tasks worker -l info --autoreload
```

