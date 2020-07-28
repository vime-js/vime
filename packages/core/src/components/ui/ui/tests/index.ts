import { newSpecPage } from '@stencil/core/testing';
import { Player } from '../../../core/player/player';
import { FakeTube } from '../../../providers/faketube/FakeTube';
import { UI } from '../ui';

export const newUISpecPage = async (components: any[], ui: string) => {
  const page = await newSpecPage({
    components: [Player, FakeTube, UI, ...components],
    html: `
      <vime-player>
        <vime-faketube></vime-faketube>
        
        <vime-ui>
          ${ui}
        </vime-ui>
      </vime-player>
    `,
  });

  const provider = page.root!.querySelector('vime-faketube')!;

  return { page, provider };
};
