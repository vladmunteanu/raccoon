Raccoon
=======

Main repository for Raccoon

Quickstart with Docker
----------------------

1. Install [Docker](https://www.docker.com/)
2. Replace in `src/raccoon/settings.py` host of mongodb from `127.0.0.1` to `db`.
3. Start the docker containers

   ```bash
   $ docker-compose up (it may take several minutes for the first time)
   ```
4. Access [http://localhost:8888/](http://localhost:8888/)
5. The app automatically will reload after editing the code. If you need to rebuild the containers just run:

   ```bash
   $ docker-compose up --rebuild
   ```

Quickstart on Ubuntu
--------------------

1. Install dependencies ([Virtual Box](https://www.virtualbox.org/wiki/Downloads), [Vagrant](https://www.vagrantup.com/downloads.html), [git](https://git-scm.com/downloads))

   ```bash
   $ sudo apt-get install virtualbox virtualbox-dkms vagrant git
   ```

2. Clone this repo into your working dir

   ```bash
   $ cd <working_dir> && git clone git@github.com:Avira/raccoon.git
   ```

3. Go to Raccoon image dir and start vagrant

   ```bash
   $ cd raccoon/image
   $ vagrant up
   ```

4. Access [http://localhost:8888/](http://localhost:8888/)


