import { useState } from "react";
import "./Pojetos.css";
import projeto1 from "../../assets/Capa ProjetoAPPReceitas.png";
import projeto2 from "../../assets/Capa ProjetoTFC.png";
import projeto3 from "../../assets/Capa ProjetoAgrix.png";
import { useNavigate } from "react-router-dom";

function ProjetosCarrosel() {
  const navigate = useNavigate();
  const projects = [
    { id: 1, image: projeto1 },
    { id: 2, image: projeto2 },
    { id: 3, image: projeto3 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carrousel-projeots">
      <h1>Alguns projetos que desenvolvi em meus estudos</h1>
      <div className="carousel">
        <button className="carousel-btn prev" onClick={prevSlide}>
          &#10094;
        </button>

        <div className="carousel-images">
          {projects.map((project, index) => (
            <img
              key={index}
              src={project.image}
              alt={`Projeto ${project.id}`}
              className={`carousel-image ${index === currentIndex ? "active" : ""}`}
              onClick={() => navigate(`/Gustavo-Portifolio/Projetos/${project.id}`)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>

        <button className="carousel-btn next" onClick={nextSlide}>
          &#10095;
        </button>

        <div className="carousel-dots">
          {projects.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjetosCarrosel;