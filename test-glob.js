const files = import.meta.glob('./src/data/user-behavior/*.csv', { query: '?raw', import: 'default', eager: true });
console.log(files);
