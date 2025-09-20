export function copyToClipboard(content) {
  navigator.clipboard
    .writeText(content)
    .then(() => alert('Copié !'))
    .catch(() => alert('Erreur lors de la copie'))
}
