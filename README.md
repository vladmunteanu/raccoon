Raccoon
=======

Main repository for Raccoon


Quickstart on Ubuntu
--------------------

1. Install dependencies ( [Virtual Box](https://www.virtualbox.org/wiki/Downloads), [Vagrant](https://www.vagrantup.com/downloads.html, [git](https://git-scm.com/downloads) )

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


