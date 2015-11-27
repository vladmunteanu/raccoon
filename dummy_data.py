import tornado.ioloop

from motorengine.connection import connect
from settings import DB
from tornado import gen

from raccoon.models import Project
from raccoon.models import Environment
from raccoon.models import Right
from raccoon.models import Build
from raccoon.models import Install
from raccoon.models import User

io_loop = tornado.ioloop.IOLoop.instance()
connect(DB['name'], host=DB['host'], port=DB['port'], io_loop=io_loop)


@gen.coroutine
def create_dummy_data():
    # create projects
    for name in ['applogic', 'webserver', 'dashboard']:
        yield Project.objects.create(name=name)

    # create envs
    for name in ['prod', 'acc', 'test', 'dev']:
        yield Environment.objects.create(name=name)

    projects = yield Project.objects.find_all()
    envs = yield Environment.objects.find_all()

    # create rights
    for project in projects:
        for env in envs:
            name = '{p}.{e}.*'.format(p=project.name, e=env.name)
            yield Right.objects.create(name=name)

    # create builds
    for project in projects:
        yield Build.objects.create(project=project, version='1.0',
                                   branch='master')

    builds = yield Build.objects.find_all()
    envs = yield Environment.objects.find_all()

    # create installs
    for build in builds:
        for env in envs:
            yield Install.objects.create(build=build, environment=env)

    rights = yield Right.objects.find_all()

    # create users
    for name in ['florin', 'mihai', 'alex', 'vitalie']:
        yield User.objects.create(
            name=name,
            email='{name}@avira.com'.format(name=name),
            username=name,
            password='password',
            rights=rights
        )

if __name__ == "__main__":
    io_loop.run_sync(create_dummy_data)
