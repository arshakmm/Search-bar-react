import { useEffect, useRef, useState } from 'react';
import './App.css';
import ReactPaginate from 'react-paginate';
import './pagiantion.css'
import { BallTriangle } from 'react-loader-spinner';
import Error from './errorMesiges/Error';

function App() {

  const [bookName, setBookName] = useState('')
  const [books, setBooks] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loader, setLoader] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');
  const ref = useRef()

  function searchBook() {
    setErrorMessage('');
    setLoader(true)
    if (!loader) {
      if (bookName !== '') {
        fetch(`http://openlibrary.org/search.json?q=${bookName}&page=`)
          .then(response => response.json())
          .then(data => {
            if (data.docs.length) {
              setBooks(data.docs)
              setTotalPages(Math.ceil(data.numFound / 100))
            } else {
              setBooks([])
              setErrorMessage('Nothing found!');
            }
          })
          .catch((erorr) => {
            setBooks([])
            setErrorMessage(erorr);
          }).finally(() => {
            setLoader(false)
          })
      }
      else {
        setLoader(false)
        setBooks([])
        setErrorMessage('Input can\'t be empty');
      }
    }

  }

  function handleKeyUp(event) {
      if (event.keyCode === 13) {
        searchBook()
      }
  }
  useEffect(() => {
    if (!loader) {
      window.addEventListener("keyup", handleKeyUp);
    }
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, [bookName, loader]);


  function changePages(currentPage) {
    setErrorMessage('');
    setLoader(true)
    fetch(`http://openlibrary.org/search.json?q=${bookName}&page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        setBooks(data.docs);
      })
      .catch((erorr) => {
        setBooks([])
        setErrorMessage(erorr);
      }).finally(() => {
        setLoader(false)
      })
  }

  useEffect(() => {
    if (errorMessage !== '') {
      setTimeout(() => {

        setErrorMessage('')
      }, "5000")
    }

  }, [errorMessage])


  return (
    <div>
      <div className="search-container">
        <input
          type="text" placeholder="Search.." id="input"
          onChange={(e) => setBookName(e.target.value)}
          onKeyDown={handleKeyUp}
          ref={ref}
        />
        <button onClick={searchBook} id="btn" ><i className="fas fa-search"></i></button>
      </div>
      {errorMessage && <Error message={errorMessage} />}
      <div>
        {
          (loader ?
            <div className='loader'>
              <BallTriangle
                height="80"
                width="80"
                radius="9"
                color='#153ef5'
                ariaLabel="loading"
                wrapperStyle

              />
            </div>
            : (<div className='bookNames'>
              {books.map((item) => (
                <div key={item._version_}>
                  <ul>
                    <li>{item.title}</li>
                  </ul>
                </div>)
              )}
            </div>))
        }
        {books.length ?
          <ReactPaginate
            activeClassName={'item active'}
            breakClassName={'item break-me '}
            containerClassName={'pagination'}
            disabledClassName={'disabled-page'}
            nextClassName={"item next "}
            pageClassName={'item pagination-page'}
            previousClassName={"item previous"}
            breakLabel="..."
            nextLabel="next >"

            previousLabel="< prev"
            renderOnZeroPageCount={null}
            pageCount={totalPages}
            onPageChange={(page) => changePages(page.selected + 1)}
          />

          : null}
      </div>
    </div>
  );
}

export default App;
