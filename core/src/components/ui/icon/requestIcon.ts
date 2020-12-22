/**
 * INSPIRED BY: https://github.com/shoelace-style/shoelace/blob/next/src/components/icon/request.ts
 */

export interface IconFile {
  ok: boolean;
  status: number;
  svg?: string;
}

const iconFiles = new Map<string, Promise<IconFile>>();

export const requestIcon = (url: string) => {
  if (iconFiles.has(url)) return iconFiles.get(url);

  const request = fetch(url)
    .then(async (response) => {
      if (response.ok) {
        const div = document.createElement('div');
        div.innerHTML = await response.text();
        const svg = div.firstElementChild;

        return {
          ok: response.ok,
          status: response.status,
          svg: svg && svg.tagName.toLowerCase() === 'svg' ? svg.outerHTML : '',
        };
      }

      return {
        ok: response.ok,
        status: response.status,
      };
    });

  iconFiles.set(url, request);
  return request;
};
