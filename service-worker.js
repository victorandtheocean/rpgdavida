// MUDANÇA AQUI: Alterado de v1 para v2 para forçar a atualização no navegador
const CACHE_NAME = 'rpg-vida-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './fundo.mp4',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalação: Baixa os arquivos para o cache
self.addEventListener('install', (event) => {
  // Força o SW a assumir o controle imediatamente, sem esperar o usuário fechar a aba
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching all assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Ativação: Limpa caches antigos se houver atualização
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // Se o cache não for o v2, apaga ele
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removendo cache antigo:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // Garante que a nova versão controle a página imediatamente
  return self.clients.claim();
});

// Interceptação: Serve os arquivos do cache quando offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna do cache se existir, senão busca na rede
        return response || fetch(event.request);
      })
  );
});