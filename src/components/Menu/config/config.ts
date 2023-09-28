import { MenuItemsType, DropdownMenuItemType } from '@metabank/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { nftsBaseUrl } from 'views/Nft/market/constants'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Swap'),
    href: '/swap',
    icon: 'Swap',
    showItemsOnMobile: false,
  },  
  {
    label: t('Farm'),
    href: '/farm',
    icon: 'Farm',
    showItemsOnMobile: false,
  },
  {
    label: t('Stake'),
    href: '/poolse',
    icon: 'Pool',
    showItemsOnMobile: false,
  },
  {
    label: t('NFTs'),
    href: '/nft-pool',
    icon: 'Nft',
    showItemsOnMobile: false,
  },
  {
    label: t('Specials'),
    href: '/earns',
    icon: 'Pool',
    showOnMobile: false,
    showItemsOnMobile: false,
  },
  {
    label: t('Add LP'),
    href: '/liquidities',
    icon: 'Add',
    showItemsOnMobile: false,
  },
  {
    label: t('Referrals'),
    href: '/referrals',
    icon: 'Groups',
    showOnMobile: false,
    showItemsOnMobile: false,
  },  
  {
    label: t('About Us'),
    href: '/#',
    icon: 'Groups',
    showItemsOnMobile: false,
  },  
]

export default config
