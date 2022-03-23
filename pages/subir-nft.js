import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftmarketaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateNFT() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ precio: '', nombre: '', descripcion: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { nombre, descripcion, precio } = formInput
    if (!nombre || !descripcion || !precio || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      nombre, descripcion, precio, imagen: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url);
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const provider = new ethers.providers.Web3Provider(window.ethereum)   
    const signer = provider.getSigner()
    
    /* next, create the item */
    let marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const precio = ethers.utils.parseUnits(formInput.precio, 'ether')

    let precioGas = await marketContract.getPrecioGas()
    precioGas = precioGas.toString()

    let transaccion = await marketContract.createToken(url, precio, {value: precioGas})
    await transaccion.wait()

    router.push('/')
  }

  return (
    <div className="container-fluid">
      <div className="mb-3">
      <label htmlFor="exampleFormControlInput1" className="form-label">Nombre</label>
        <input 
          placeholder="Nombre del NFT"
          className="form-control"
          type="text"
          onChange={e => updateFormInput({ ...formInput, nombre: e.target.value })}
        /><br></br>
        <label htmlFor="exampleFormControlTextarea1" className="form-label">Descripción</label>
        <textarea
          placeholder="Descripción del NFT"
          className="form-control"
          type="text"
          onChange={e => updateFormInput({ ...formInput, descripcion: e.target.value })}
        /><br></br>
        <label htmlFor="exampleFormControlTextarea1" className="form-label">Precio</label>
        <input
          placeholder="Precio del NFT (Eth)"
          className="form-control"
          type="number"
          onChange={e => updateFormInput({ ...formInput, precio: e.target.value })}
        /><br></br>
        <label htmlFor="formFileSm" className="form-label">Imagen</label>
        <input
          type="file"
          id="formFileSm"
          name="Asset"
          className="form-control form-control-sm"
          onChange={onChange}
        /><br></br>
        {
          fileUrl && (
            <img className="rounded mx-auto d-block" width="150" src={fileUrl} />
          )
        }<br></br>
        <button onClick={createMarket} className="btn btn-primary d-grid gap-2 col-2 mx-auto">
          Crear NFT
        </button>
      </div>
    </div>
  )
}