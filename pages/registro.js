import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'

import {
  nftmarketaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function Registro() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    cargarNFTs()
  }, [])

  async function cargarNFTs() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)  
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const data = await marketContract.getMisNFTsCreados()
    
    const nfts = await Promise.all(data.map(async i => {
      const tokenUri = await marketContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let nft = {
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        vendido: i.vendido,
        imagen: meta.data.imagen,
        nombre: meta.data.nombre
      }
      return nft
    }))


    setNfts(nfts)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) 
    return (
      <div className="container">
        <hr className="mt-2 mb-5"></hr>
        <h1 className="py-10 px-20 text-3xl alert alert alert-warning alert-dismissible fade show text-center">
          No he creado ningún NFT
        </h1>
      </div>
    )
  return (
    <div className="container">
      <h2>NFTs creados</h2>
      <hr className="mt-2 mb-5"></hr>
      <div className="row text-center text-lg-start">
        {
          nfts.map((nft, i) => (
            <div key={i} className="col-lg-3 col-md-4 col-6">
              <div className="card">
                <div className="card-header">
                  <p className="card-title ">Token ID: {nft.tokenId}</p>
                </div>
                <img src={nft.imagen} className="img-fluid img-thumbnail"/>
                <div className="card-body">
                  <p className="card-text">Nombre: {nft.nombre}</p>
                </div>
              </div>
              <hr></hr>
          </div>
          ))
        }
      </div>
    </div>
  )
}