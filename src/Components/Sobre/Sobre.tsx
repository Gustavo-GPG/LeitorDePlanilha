import './Sobre.css';
import reactLogo from '../../assets/react.svg';

function Sobre() {
    return (
        <div className='sobre-container'>
            <h1 className='titulo-sobre'>Um pouco sobre mim</h1>
            <div className='main-content'>
                <p className='sobre'>
                    Desde criança, sempre fui fascinado por tecnologia e tive contato com computadores desde cedo, 
                    o que despertou minha curiosidade por esse universo. 
                    Iniciei minha graduação em Engenharia Elétrica,
                    mas, durante a pandemia, tive meu primeiro contato com a programação por meio de cursos e me apaixonei pela área,
                    especialmente pelo desenvolvimento back-end.

                    Decidi mudar de caminho, deixei a engenharia de lado e me dediquei aos estudos de programação. 
                    Para isso, trabalhei para comprar meu próprio computador e poder estudar e praticar diariamente. 
                    Em agosto de 2024, concluí o curso de Desenvolvimento Web Full Stack pela Trybe, onde aprendi muitas habilidades tanto hard skils quanto soft skills e conquistei minha certificação.

                    Agora, estou em busca da minha primeira oportunidade como desenvolvedor.
                </p>
                <div className="image-container">
                    <img className='image-sobre' src={reactLogo} alt="react" />
                </div>
            </div>
        </div>
    )
}

export default Sobre;