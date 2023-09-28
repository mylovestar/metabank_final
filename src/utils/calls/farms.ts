import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import Cookies from 'universal-cookie';
import rot13 from 'utils/encode';
import { isAddress } from 'utils';
import { BIG_TEN } from 'utils/bigNumber'

let options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const cookies = new Cookies();

export const stakeFarm = async (masterChefContract, pid, amount, decimals) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString()

  let ref
  if(cookies.get('ref')) {
    if(isAddress( rot13(cookies.get('ref')) )) {
      ref = rot13(cookies.get('ref'))
    }
  } else {
    ref = "0x0000000000000000000000000000000000000000"
  }

  if (pid == 4)
    options.gasLimit = 700000;
  else 
    options.gasLimit = DEFAULT_GAS_LIMIT;

  return masterChefContract.deposit(pid, value, ref)
}

export const unstakeFarm = async (masterChefContract, pid, amount, decimals) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString()

  //   if (pid == 4)
  //   options.gasLimit = 700000;
  // else 
  //   options.gasLimit = DEFAULT_GAS_LIMIT;

  return masterChefContract.withdraw(pid, value, { gasPrice })
}

export const harvestFarm = async (masterChefContract, pid) => {
  const gasPrice = getGasPrice()

  let ref
  if(cookies.get('ref')) {
    if(isAddress( rot13(cookies.get('ref')) )) {
      ref = rot13(cookies.get('ref'))
    }
  } else {
    ref = "0x0000000000000000000000000000000000000000"
  }

  
  if (pid == 4)
    options.gasLimit = 700000;
  else 
    options.gasLimit = DEFAULT_GAS_LIMIT;

  return masterChefContract.deposit(pid, '0', ref, { ...options, gasPrice })
}
