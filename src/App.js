import { useEffect, useState } from 'react';
import './App.css';
import ReactPaginate from 'react-paginate';
import './pagiantion.css'
import { Audio } from 'react-loader-spinner';

function App() {

  const [bookName, setBookName] = useState('')
  const [books, setBooks] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loader, setLoader] = useState(false)

  function searchBook() {
    setLoader(true)
    if (bookName !== '') {
      fetch(`http://openlibrary.org/search.json?q=${bookName}&page=`)
        .then(response => response.json())
        .then(data => {
          if (data.docs.length) {
            setBooks(data.docs)
            setTotalPages(Math.ceil(data.numFound / 100))
            setLoader(false)
          }

        })
        .catch((erorr)=>{
          console.log(erorr,'assdddsd')
        })

    }

  }

  function changePages(currentPage) {
    fetch(`http://openlibrary.org/search.json?q=${bookName}&page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        setBooks(data.docs);
      })
      .catch((erorr)=>{
        console.log(erorr,'assdddsd')
      })
  }

  return (
    <div>
      <input
        onChange={(e) => setBookName(e.target.value)} />
      <button onClick={searchBook}>Search</button>
      <div>
        {
          loader ? <Audio
          height="80"
          width="80"
          radius="9"
          color="green"
          ariaLabel="loading"
          wrapperStyle
          wrapperClass
          />: (<div>{books.map(item => (
            <div key={item._version_}>{item.title}</div>
          ))}

            {books.length ?
              <ReactPaginate
                activeClassName={'item active '}
                breakClassName={'item break-me '}
                containerClassName={'pagination'}
                disabledClassName={'disabled-page'}
                nextClassName={"item next "}
                pageClassName={'item pagination-page '}
                previousClassName={"item previous"}
                breakLabel="..."
                nextLabel="next >"

                previousLabel="< prev"
                renderOnZeroPageCount={null}
                pageCount={totalPages}
                onPageChange={(page) => changePages(page.selected + 1)}
              /> : null}</div>)



        }

      </div>


    </div>
  );
}

export default App;
