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
        <div className='navbar-brand'>
          <a className="navbar-brand" href="#">
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='60'
                height='60'
                fill='currentColor'
                className='bi bi-box'
                viewBox='0 0 16 16'
              >
                <path d='M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z' />
              </svg>
          </a>
        </div>
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