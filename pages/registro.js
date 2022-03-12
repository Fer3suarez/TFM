import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function Registro() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    cargarNFTs()
  }, [])

  async function cargarNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)  
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.getMisNFTsCreados()
    
    const nfts = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
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

    const nftsNoDuplicados = [];
    nfts.forEach((item)=>{
      let entra = true;
    	for(var i=0; i<nftsNoDuplicados.length; i++){
        if(item.tokenId == nftsNoDuplicados[i].tokenId){
          entra = false;
        }
      }
      if (entra) nftsNoDuplicados.push(item);
    })

    /* create a filtered array of items that have been sold */
    const nftsVendidos = nftsNoDuplicados.filter(i => i.vendido)
    setSold(nftsVendidos)
    setNfts(nftsNoDuplicados)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) 
    return (
      <div className="container">
        <hr className="mt-2 mb-5"></hr>
        <h1 className="py-10 px-20 text-3xl alert alert-warning text-center">
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
      {Boolean(sold.length) && (
        <div>
          <h2>NFTs vendidos</h2>
          <hr className="mt-2 mb-5"></hr>
          <div className="row text-center text-lg-start">
            {
              sold.map((nft, i) => (
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
      )}
    </div>
  )
}