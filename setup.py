from __future__ import absolute_import

from distutils.core import setup
from setuptools import find_packages


import os


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
    version='1.0.0',
    description='Raccoon - Deployment Tool',
    author='Raccoon Team',
    author_email='support@raccon.local',
    packages=find_packages('src'),
    package_dir={'raccoon': 'src/raccoon'},
    include_package_data=True,
    install_requires=[
        'tornado>=4.4.2',
        'motorengine',
    ],
    data_files=recursiveFileList('/usr/local/raccoon/sys', 'sys') +
                 recursiveFileList('/usr/local/raccoon/web', 'web') +
                 recursiveFileList('/usr/local/raccoon/src', 'src'),
    entry_points={},
)
