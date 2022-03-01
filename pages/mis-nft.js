import {  ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MisNFTs() {
  const [nfts, setNfts] = useState([])
  const [nft, setNft] = useState({})
  const [loadingState, setLoadingState] = useState('not-loaded')
	const [id, setId] = useState(null)
	const [owner, setOwner] = useState('')

  const router = useRouter()
  useEffect(() => {
    cargarNFTs()
  }, [])

 async function venderNFT(nft) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

    setId(nft.tokenId)

    const tokenOwner = await tokenContract.ownerOf(nft.tokenId)
    setOwner(tokenOwner)

    const nftData = await tokenContract.tokenURI(nft.tokenId)
    const data = await axios.get(nftData)

    setLoadingState("loaded")
    setNft(data.data)

    let precioGas = await marketContract.getPrecioGas()
    precioGas = precioGas.toString()
    const nftPrecio = ethers.utils.parseUnits(nft.precio.toString(), 'ether')
  
    let tx = await marketContract.ponerNFTMercado(
      nftaddress,
      nft.tokenId,
      nftPrecio,
      { value: precioGas }
    )

    await tx.wait()
    setLoadingState('loaded') 
    router.push('/')
  }

  async function cargarNFTs() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)  
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

    let account = await signer.getAddress()
    const data = await marketContract.getMisNFTs()
    
    const nfts = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const tokenId = i[0].toNumber()
      const meta = await axios.get(tokenUri)
      let precio = ethers.utils.formatUnits(i.precio.toString(), 'ether')
      let nft = {
        precio,
        nombre: meta.data.nombre,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        imagen: meta.data.imagen
      }
      return nft
    }))
    setNfts(nfts)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No tengo NFTs</h1>)
  return (
    <div className="container">
      <h2>Mis NFTs</h2>
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
                  <p className="card-text">Precio - {nft.precio} ETH</p>
                  <button onClick={() => venderNFT(nft)} className="btn btn-primary rounded mx-auto d-block">Poner a la venta por: {nft.precio} ETH</button>
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