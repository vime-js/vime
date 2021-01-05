import { isUndefined } from '../../../../utils/unit';

function unwrapSubmenu(el: Element) {
  if (el.tagName.toLowerCase() !== 'vm-submenu')
    return el as HTMLVmMenuItemElement;
  const submenu = el as HTMLVmSubmenuElement;
  return submenu.shadowRoot!.querySelector('vm-menu-item')!;
}

function unwrapRadioGroup(el: Element) {
  if (el.tagName.toLowerCase() !== 'vm-menu-radio-group')
    return el as HTMLVmMenuItemElement;
  const radioGroup = el as HTMLVmMenuRadioGroupElement;
  const slot = radioGroup.shadowRoot!.querySelector('slot');
  const assignedElements = Array.from(slot?.assignedElements() ?? []);
  return assignedElements
    .filter((radio) => radio.tagName.toLowerCase() === 'vm-menu-radio')
    .map(
      (radio) => radio.shadowRoot!.querySelector('vm-menu-item')!,
    ) as HTMLVmMenuItemElement[];
}

export function menuItemHunter(assignedElements?: Element[]) {
  if (isUndefined(assignedElements)) return [];

  const allowed = ['vm-menu-item', 'vm-menu-radio-group', 'vm-submenu'];

  return Array.from(assignedElements ?? [])
    .filter((el) => allowed.includes(el.tagName.toLowerCase()))
    .map((el) => unwrapSubmenu(el))
    .map((el) => unwrapRadioGroup(el))
    .reduce(
      (acc, val) => (acc as any).concat(val),
      [],
    ) as HTMLVmMenuItemElement[];
}
