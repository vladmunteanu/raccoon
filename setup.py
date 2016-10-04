from __future__ import absolute_import

from distutils.core import setup
from setuptools import find_packages


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
)
