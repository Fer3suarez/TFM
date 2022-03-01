import Link from 'next/link'
import Head from "next/head";

function GaleriaArte({ Component, pageProps }) {
  return (
    <>
    <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossOrigin="anonymous" />
    </Head>
    <div className='container-fluid'>
      <p className="h1 text-center">TFM Fernando Suárez</p>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div>
          <ul className="navbar-nav">
            <li className="nav-item"><Link href="/">
              <a className="nav-link">
                Galeria
              </a>
            </Link></li>
            <li className="nav-item"><Link href="/subir-nft">
              <a className="nav-link">
                Subir NFT
              </a>
            </Link></li>
            <li className="nav-item"><Link href="/mis-nft">
              <a className="nav-link">
                Mis NFTs
              </a>
            </Link></li>
            <li className="nav-item"><Link href="/registro">
              <a className="nav-link">
                Registro
              </a>
            </Link></li>
          </ul>
        </div>
      </nav>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossOrigin="anonymous"></script>
      <Component {...pageProps} />
    </div>
    </>
  )
}

export default GaleriaArte