import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Web3Modal from "web3modal"


import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

let rpcEndpoint = null

export default function Galeria() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()
  useEffect(() => {
    loadNFTs()
  }, [])
  
  async function loadNFTs() {    
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.getNFTsMercado()
    
    const nfts = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let precio = ethers.utils.formatUnits(i.precio.toString(), 'ether')
      let nft = {
        precio,
        nftId: i.nftId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        imagen: meta.data.imagen,
        nombre: meta.data.nombre,
        descripcion: meta.data.descripcion,
      }
      return nft
    }))
    setNfts(nfts)
    setLoadingState('loaded') 
  }
  async function comprarNFT(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection) 
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const precio = ethers.utils.parseUnits(nft.precio.toString(), 'ether')
    const transaccion = await contract.compraNFT(nftaddress, nft.nftId, {
      value: precio
    })
    await transaccion.wait()
    //loadNFTs()
    router.push('/mis-nft')
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No hay NFTs en el mercado</h1>)
  return (
    <div className="container">
      <hr className="mt-2 mb-5"></hr>
      <div className="row text-center text-lg-start">
        {
          nfts.map((nft, i) => (
            <div key={i} className="col-lg-3 col-md-4 col-6">
                <div className="card">
                  <img src={nft.imagen} className="img-fluid img-thumbnail" alt="{nft.nombre}"/>
                  <div className="card-body">
                    <h5 className="card-title">{nft.nombre}</h5>
                    <p className="card-text">{nft.descripcion}</p>
                    <button onClick={() => comprarNFT(nft)} className="btn btn-primary rounded mx-auto d-block">Comprar: {nft.precio} ETH</button>
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
