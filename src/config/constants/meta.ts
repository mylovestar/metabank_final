import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'MetaBank',
  description:
    'A Friendly Decentralized Exchange',
  image: '/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('METABANK')} | ${t('Home')}`,
      }
    case '/swap':
      return {
        title: `${t('METABANK')} | ${t('Exchange')}`,
      }
    case '/add':
      return {
        title: `${t('Crypto Liquidity Pool')} | ${t('Add Liquidity')}`,
      }
    case '/remove':
      return {
        title: `${t('Crypto Liquidity Pool')} | ${t('Remove Liquidity')}`,
      }
    case '/liquidity':  
      return {
        title: `${t('Crypto Liquidity Pool')} | ${t('Liquidity Pools')}`,
      }
    case '/find':
      return {
        title: `${t('Crypto Liquidity Pool')} | ${t('Import Pool')}`,
      }
    case '/competition':
      return {
        title: `${t('METABANK')} | ${t('Trading Battle')}`,
      }
    case '/prediction':
      return {
        title: `${t('METABANK')} | ${t('Prediction')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('METABANK')} | ${t('Leaderboard')}`,
      }
    case '/farms':
      return {
        title: `${t('Yield Farming Platform')} | ${t('Crypto Farming')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Yield Farming Platform')} | ${t('Farm Auctions')}`,
      }
    case '/pools':
      return {
        title: `${t('Crypto Staking Rewards')} | ${t('Cryptocurrency Staking')}`,
      }
    case '/referral':
      return {
        title: `${t('Cryptocurrency Affiliate Program')} | ${t('Referrals')}`,
      }
    case '/lottery':
      return {
        title: `${t('METABANK')} | ${t('Lottery')}`,
      }
    case '/ifo':
      return {
        title: `${t('METABANK')} | ${t('Initial Farm Offering')}`,
      }
    case '/teams':
      return {
        title: `${t('METABANK')} | ${t('Leaderboard')}`,
      }
    case '/voting':
      return {
        title: `${t('METABANK')} | ${t('Voting')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('METABANK')} | ${t('Proposals')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('METABANK')} | ${t('Make a Proposal')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('METABANK Info & Analytics')}`,
        description: 'View statistics for METABANK exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('METABANK Info & Analytics')}`,
        description: 'View statistics for METABANK exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('METABANK Info & Analytics')}`,
        description: 'View statistics for METABANK exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('METABANK')} | ${t('Overview')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('METABANK')} | ${t('Collections')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('METABANK')} | ${t('Activity')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('METABANK')} | ${t('Profile')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('METABANK')} | ${t('Pancake Squad')}`,
      }
    default:
      return null
  }
}
