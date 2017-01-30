Raccoon
=======

Main repository for Raccoon


Quickstart on Ubuntu
--------------------

1. Install [Virtual Box](https://www.virtualbox.org/wiki/Downloads)

   ```bash
   $ sudo apt-get install virtualbox virtualbox-dkms
   ```

2. Install [Vagrant](https://www.vagrantup.com/downloads.html)
    ```bash
   $ sudo apt-get install vagrant
   ```

3. Install [git](https://git-scm.com/downloads)

   ```bash
   $ sudo apt-get install git
   ```

4. Clone this repo into your working dir

   ```bash
   $ cd <working_dir> && git clone git@github.com:Avira/raccoon.git
   ```

5. Go to Raccoon image dir and start vagrant

   ```bash
   $ cd raccoon/image
   $ vagrant up
   ```

6. Access http://localhost:8888/


