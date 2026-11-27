export function validateUrlInput(rawUrl) {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return 'Please enter a URL to shorten.';
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return 'URL must start with http:// or https://';
    }
    if (!parsed.hostname || (parsed.hostname !== 'localhost' && !parsed.hostname.includes('.'))) {
      return 'Please enter a valid domain name (e.g., https://example.com).';
    }
    return null;
  } catch {
    return 'Please enter a valid URL starting with http:// or https://';
  }
}

export function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}
