import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import './section_books.css';
import './section_wishlist.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
// import { Swiper, useSwiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination } from 'swiper/modules';
import { register } from 'swiper/element/bundle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js';



function App() {
  
  //Tab Home 
  
  const [activeTab, setActiveTab] = useState('home'); 
  // const swiper = useSwiper();
  register();
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  //Tab Books Available
  
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [activeBookTab, setActiveBookTab] = useState('tab1'); 
  
  const filterBooksByGenre = (genre) => {
    if (genre === 'Todos') {
      setFilteredBooks(books); 
    } else {
      const filtered = books.filter((book) => book.Genero === genre);
      setFilteredBooks(filtered); 
    }
  };
  
  useEffect(() => {
    axios.get('/books')
      .then(response => {
        setBooks(response.data.data);  
      })
      .catch(error => {
        console.error("Houve um erro ao buscar os livros!", error);
      });
  }, []);
  
  const handleBookTabChange = (tab, genre) => {
    setActiveBookTab(tab);
    filterBooksByGenre(genre); // Chama a função de filtro
  };
  
  //Tab Wish List
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    autor: '',
    preco: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    autor: '',
    preco: ''
  });
  
  
  const rules = {
    required: value => !!value || 'Campo obrigatório',
    email: value => /\S+@\S+\.\S+/.test(value) || 'Email inválido',
    preco: value => /^\d+(\.\d{2})?$/.test(value) || 'O preço deve estar no formato 0.00'
  };
  
  
  const validateField = (fieldName, value) => {
    let error = rules.required(value); 
    
    if (fieldName === 'email' && !error) { 
      error = rules.email(value);
    }
    
    if (fieldName === 'preco' && !error) {
      error = rules.preco(value); 
    }
    
    setErrors({
      ...errors,
      [fieldName]: error
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    validateField(name, value);
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let formIsValid = true;
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        formIsValid = false;
      }
    });
    
    if (formIsValid) {
      try {
        const response = await axios.post('postWishList', {
          Nome: formData.name,
          Email: formData.email,
          Livro: formData.bookTitle,
          Autor: formData.author,
          Preco: formData.preco
        });
        console.log('Formulário enviado com sucesso!', response.data);
        handleShowModal(); 
      } catch (error) {
        console.error('Erro ao enviar formulário:', error.response.data);
      }
    } else {
      console.log('Erro de validação. Verifique os campos.');
    }
    
  };
  
  // Dialog
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [currentItem, setCurrentItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    Nome: '',
    Email: '',
    Livro: '',
    Autor: '',
    Preco: ''
  });
  
  const handleUpdate = (item) => {
    setCurrentItem(item); 
    setEditFormData(item); 
    setShowEditModal(true); 
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value }); 
  };
  
  const handleSave = () => {
    console.log("Dados enviados para atualização:", editFormData);
    console.log("ID do item atual:", currentItem.Id); 
    
    axios.put(`/updateWishList/${currentItem.Id}`, editFormData) 
      .then(response => {
        
        const updatedList = myWishList.map(item => item.Id === currentItem.Id ? editFormData : item);
        setMyWishList(updatedList);
        setShowEditModal(false);
        console.log("Atualização bem-sucedida:", response.data); 
      })
      .catch(error => {
        console.error("Erro ao atualizar o registro:", error);
      });
  };

  const closeEditModal = () => {
    setShowEditModal(false); // Fecha apenas o modal de edição
  };

  
  const handleDelete = (id) => {
    axios.delete(`/deleteWishList/${id}`)
      .then(response => {
        console.log(`Item com ID ${id} foi deletado.`);
        setMyWishList(myWishList.filter(item => item.Id !== id)); 
        setShowDeleteModal(true); 
      })
      .catch(error => {
        console.error(`Erro ao deletar o item com ID ${id}:`, error);
      });
  };
  
  const closeModal = () => {
    setShowDeleteModal(false); 
  };
  
  
  
  const handleShowModal = () => {
    setShowModal(true);
  };
  
  useEffect(() => {
    if (showModal) {
      const modalElement = document.getElementById('exampleModal');
      const bootstrapModal = new Modal(modalElement);
      bootstrapModal.show();
    }
  }, [showModal]);
  
  // Table
  
  const [myWishList, setMyWishList] = useState([]); 
  const [headers, setHeaders] = useState([]); 
  
  
  useEffect(() => {
    axios.get('/wishList')
      .then(response => {
        setMyWishList(response.data.data); 
        if (response.data.data.length > 0) {
          
          setHeaders(Object.keys(response.data.data[0]).filter(key => key !== 'Id')); 
        }
      })
      .catch(error => {
        console.error("Houve um erro!", error);
      });
  }, []);
  
  
  
  return (
    <div>
      <header>
        <div className="container-fluid custom-header">
          <div className="row">
            <div className="col-md-2">
              <div className="main-logo" style={{ paddingTop: '10px' }}>
                <img src="/images/logo-no-background.png" alt="Logo" className="img-fluid" />
              </div>
            </div>
            <div className="col-md-10">
              <ul className="nav nav-tabs justify-content-end custom-nav-tabs" id="homeTab" role="tablist">
                <li className="nav-item " role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} // Define a aba ativa
                    id="home-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#home-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="home-tab-pane"
                    aria-selected={activeTab === 'home'} // Define o aria-selected
                    onClick={() => handleTabChange('home')} // Muda a aba quando clicado
                  >
                    Início
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
                    id="books-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#books-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="books-tab-pane"
                    aria-selected={activeTab === 'books'}
                    onClick={() => handleTabChange('books')}
                  >
                    Livros Disponiveís
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'wish-list' ? 'active' : ''}`}
                    id="wish-list-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#wish-list-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="wish-list-tab-pane"
                    aria-selected={activeTab === 'wish-list'}
                    onClick={() => handleTabChange('wish-list')}
                  >
                    Lista de Desejos
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      
      {/* Tab Home */}
      <main className="py-5 my-6 custom-background" id="home-tab">
        <div className="container">
          <div className="tab-content">
            <div
              className={`tab-pane fade ${activeTab === 'home' ? 'show active' : ''}`}
              id="home-tab-pane"
              role="tabpanel"
            >
              <div className="row align-items-center justify-content-between">
                <div className="col-lg-5 order-lg-1">
                  <span className="section-subtitle" data-aos="fade-up">Bem vindo à Bookstore</span>
                  <h1 className="mb-3" data-aos="fade-up">
                    Onde cada página se transforma em uma jornada
                  </h1>
                  <p data-aos="fade-up">
                    Aqui, em nosso sebo, você encontra um universo de histórias, conhecimentos e curiosidades. Especializados em livros usados, raridades e edições esgotadas, oferecemos um acervo único para leitores apaixonados e colecionadores exigentes. Cada obra em nossas prateleiras carrega uma história própria, uma jornada que já percorreu outros olhos e mentes, e que agora está à espera de um novo capítulo com você.
                    
                    Seja para descobrir clássicos esquecidos, relíquias literárias ou apenas para folhear algo diferente, nossa livraria é o lugar perfeito para quem ama o charme e a autenticidade dos livros de segunda mão. Aqui, cada livro tem uma história para contar, e estamos ansiosos para ajudá-lo a encontrar a sua próxima grande leitura.
                    
                    Explore, descubra e apaixone-se!
                  </p>
                  <p className="mt-3" data-aos="fade-up">
                    <button type="submit" className="btn-get-started">Compre Agora</button>
                  </p>
                  
                </div>
                
                <div className="col-lg-5 order-lg-1">
                  <swiper-container
                    style={
                      {
                        "--swiper-navigation-color": "#fff",
                        "--swiper-pagination-color": "#fff",
                        "--swiper-pagination-bullet-inactive-color": "#fff",
                        "--swiper-pagination-bullet-inactive-opacity": "0.2",
                        "--swiper-pagination-bullet-size": "8px",
                        "--swiper-pagination-bullet-horizontal-gap": "4px",
                        
                        
                      }}
                    pagination-clickable="true" autoplay="true"
                    navigation="true"
                    className="custom-swiper-container"
                    grid="true"
                    slides-per-view="1"
                  >
                    <swiper-slide lazy="true" className="custom-swiper-slide">
                      <img src="/images/home/1.jpeg" loading="lazy" alt="" className="custom-swiper-img" />
                    </swiper-slide>
                    <swiper-slide lazy="true" className="custom-swiper-slide">
                      <img loading="lazy" src="/images/home/2.jpeg" alt="" className="custom-swiper-img" />
                    </swiper-slide>
                    <swiper-slide lazy="true" className="custom-swiper-slide">
                      <img loading="lazy" src="/images/home/3.jpeg" alt="" className="custom-swiper-img" />
                    </swiper-slide>
                    
                  </swiper-container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      
      
      {/* Tab Books Available */}
      <main className=" py-0 custom-background" id="books-tab">
        <div className="container-fluid" >
          <div className="tab-content">
            <div
              className={`tab-pane fade ${activeTab === 'books' ? 'show active' : ''}`}
              id="books-tab-pane"
              role="tabpanel"
            >
              <div className="row">
                <div className="col-md-12">
                  <div className="section-header align-center" >
                    <h2 className="section-title" >Livros Populares</h2>
                  </div>
                  <ul className="custom-tabs">
                    {['Todos', 'Auto Ajuda', 'Escolar', 'Romance', 'Terror', 'Ficcao'].map((genre, index) => (
                      <li
                        key={index}
                        className={`tab ${activeBookTab === `tab${index + 1}` ? 'active' : ''}`}
                        onClick={() => handleBookTabChange(`tab${index + 1}`, genre)}
                      >
                        <button
                          className={`nav-link ${index === 0 ? 'custom-tab-text' : ''} ${activeBookTab === `tab${index + 1}` ? 'active' : ''}`}
                          id={`tab${index + 1}`}
                          type="button"
                          role="tab"
                          aria-controls={`tab${index + 1}-pane`}
                          aria-selected={activeBookTab === `tab${index + 1}`}
                        >
                          {genre}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="tab-content">
                    {['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6'].map((tab, index) => (
                      <div key={index} id={`${tab}-pane`} className={`tab-pane ${activeBookTab === tab ? 'show active' : ''}`}>
                        <div className="row">
                          {filteredBooks.map((book) => (
                            <div className="col-md-3" key={book.Id}>
                              <div className="list-item">
                                <figure className="list-style">
                                  <img
                                    src={book.Imagem}
                                    alt={book.Nome || 'Imagem não disponível'}
                                    className="list-item"
                                  />
                                  <button type="button" className="add-to-cart" data-product-tile="add-to-cart">
                                    Add to Cart
                                  </button>
                                </figure>
                                <figcaption>
                                  <h3>{book.Nome}</h3>
                                  <span>{book.Autor}</span>
                                  <div className="item-price">R$ {book.Preco.toFixed(2)}</div>
                                </figcaption>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  
                </div>
                
                
                
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Tab Wish List */}
      <main className="custom-background" id="wish-list-tab">
        <div className="container">
          <div className="tab-content">
            <div
              className={`tab-pane fade ${activeTab === 'wish-list' ? 'show active' : ''}`}
              id="wish-list-tab-pane"
              role="tabpanel"
            >
              <div className="row">
                <div className="col">
                  <div className="wishlist-section-header align-center">
                    <div className="title">
                      <h2 className="wishlist-section-title">Lista de Desejos</h2>
                      <span>Qual livro você gostaria de ver na nossa loja?</span>
                    </div>
                  </div>
                </div>
                
                <div className="wishlist-border-custom-forms">
                  <div className="row wishlist-custom-forms">
                    <div className="col-8">
                      <form onSubmit={handleSubmit}>
                        <div className="row" style={{ paddingTop: '20px' }}>
                          <div className="col">
                            <label htmlFor="name" className="form-label">Nome</label>
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                            />
                            {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                          </div>
                        </div>
                        
                        <div className="row " style={{ paddingTop: '20px' }}>
                          <div className="col">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange} />
                            {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                          </div>
                          
                        </div>
                        
                        <div  className="row " style={{ paddingTop: '20px' }}>
                          <div className="col">
                            <label htmlFor="bookTitle" className="form-label">Nome do Livro</label>
                            <input
                              type="text"
                              className="form-control"
                              id="bookTitle"
                              name="bookTitle"
                              value={formData.bookTitle}
                              onChange={handleChange} />
                            {errors.bookTitle && <span style={{ color: 'red' }}>{errors.bookTitle}</span>}
                          </div>
                        </div>
                        
                        
                        <div  className="row " style={{ paddingTop: '20px' }}>
                          <div className="col">
                            <label htmlFor="bookTitle" className="form-label">Autor</label>
                            <input
                              type="text"
                              className="form-control"
                              id="autor"
                              name="autor"
                              value={formData.autor}
                              onChange={handleChange} />
                            {errors.autor && <span style={{ color: 'red' }}>{errors.autor}</span>}
                          </div>
                        </div>
                        <div className="row" style={{ paddingTop: '20px' }}>
                          <div className="col">
                            <label htmlFor="bookTitle" className="form-label">Quanto pagaria por ele?</label>
                            <div className="input-group mb-3">
                              <span className="input-group-text">R$</span>
                              <input
                                type="text"
                                className="form-control"
                                id="preco"
                                name="preco"
                                value={formData.preco}
                                onChange={handleChange}
                                aria-label="Preço no formato 0.00" />
                              
                            </div>
                          </div>
                          {errors.preco && <span style={{ color: 'red' }}>{errors.preco}</span>}
                        </div>
                        <div className="mb-3 text-end">
                          <button className="btn btn-primary wishlist-btn" onClick={handleShowModal}>Enviar</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
                
              </div>
              
              <div className="mb-3">
                <div className="row">
                  <div className="col">
                    <div className="wishlist-section-header align-center">
                      <div className="title">
                        <span>Minha lista de desejos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="mb-3">
                <div className="row">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-dark">
                        <tr>
                          {headers.map((header, index) => (
                            <th scope="col" key={index}>{header}</th>
                          ))}
                          <th scope="col">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myWishList.length > 0 ? (
                          myWishList.map((item, index) => (
                            <tr key={index}>
                              {headers.map((header, idx) => (
                                <td key={idx}>{item[header]}</td>
                              ))}
                              <td>
                                <button 
                                  className="btn btn-warning btn-sm me-1" 
                                  onClick={() => handleUpdate(item)}>
                                  Atualizar
                                </button>
                                <button 
                                  className="btn btn-danger btn-sm" 
                                  onClick={() => handleDelete(item.Id)}>
                                  Deletar
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={headers.length + 1} className="text-center">Nenhum item encontrado</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              
            </div>
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            {/* Dialog Post */}
            <div
              // ref={modalRef} // Usando ref em vez de getElementById
              className="modal"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content ">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Registro Inserido com Sucesso
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dialog update */}
            {showEditModal && (
              <div className="modal show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Editar Registro</h5>
                      <button type="button" className="btn-close" onClick={closeEditModal}></button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <div className="mb-3">
                          <label htmlFor="Nome" className="form-label">Nome</label>
                          <input type="text" className="form-control" id="Nome" name="Nome" value={editFormData.Nome} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="Email" className="form-label">Email</label>
                          <input type="email" className="form-control" id="Email" name="Email" value={editFormData.Email} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="Livro" className="form-label">Livro</label>
                          <input type="text" className="form-control" id="Livro" name="Livro" value={editFormData.Livro} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="Autor" className="form-label">Autor</label>
                          <input type="text" className="form-control" id="Autor" name="Autor" value={editFormData.Autor} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="Preco" className="form-label">Preço</label>
                          <input type="number" className="form-control" id="Preco" name="Preco" value={editFormData.Preco} onChange={handleInputChange} />
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancelar</button>
                      <button type="button" className="btn btn-primary" onClick={handleSave}>Salvar</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            
            
            
            
            
            {/* Dialog delete */}
            {showDeleteModal && (
              <div className="modal show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Exclusão bem-sucedida</h5>
                      <button type="button" className="btn-close" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body">
                      <p>O registro foi excluído com sucesso.</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-primary" onClick={closeModal}>Fechar</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            
            
            
          </div>
          
        </div>
        
      </main>
      
      
      
    </div>
    
    
    
    
    
    
    
  );
}

export default App;