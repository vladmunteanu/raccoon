from __future__ import absolute_import

from distutils.core import setup
from setuptools import find_packages
import subprocess
import sys
import os


version = '1.0.0' 
desc = "Raccoon - Deployment tool"

def recursiveFileList(dest, dirr):
    return [(dest + x[0].replace(dirr, ''), map(lambda y: x[0] + '/' + y, x[2]))
            for x in os.walk(dirr)]

def recursiveConfigFileList(dest, dirr):
    ls = []
    for x in os.walk(dirr):
        filtered = [z for z in x[2] if 'local' not in z]
        ls.append((
            dest + x[0].replace(dirr, ''), map(lambda y: x[0] + '/' + y, filtered)))
    return ls


setup(
    name='raccoon',
    version=version,
    description=desc,
    classifiers=[],
    package_dir={'': 'src'},
    packages=find_packages('src'),
    include_package_data=True,
    zip_safe=True,
    install_requires=[
      'pip',
      'tornado>=4.2.1',
    ],
    #data_files=[] +
    #    recursiveFileList('/usr/share/raccoon/web', 'web') +
    #    recursiveConfigFileList('/etc/raccoon', 'sys/config') + 
    #    [
    #        ('/usr/bin', ['sys/bin/raccoon', 'sys/bin/raccoonshell']),
    #        ('/etc/init', ['sys/init/raccoon.conf']),
    #    ],
    entry_points={},
)


