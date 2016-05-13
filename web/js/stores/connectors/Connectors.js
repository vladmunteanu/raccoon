import ConnectorStore from '../../stores/ConnectorStore';


ConnectorStore.register('github', [
    {id: 'branches', label: 'Branches'},
]);

ConnectorStore.register('jenkins', [
    {id: 'build', label: 'Build'},
    {id: 'install', label: 'Install'},
    {id: 'config', label: 'Config'},
]);

ConnectorStore.register('salt', [
    {id: 'build', label: 'Build'},
    {id: 'install', label: 'Install'},
]);

export default ConnectorStore;
