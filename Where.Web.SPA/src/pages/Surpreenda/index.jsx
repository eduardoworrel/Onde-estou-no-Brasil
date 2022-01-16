import { Box, Button, Heading } from '@dracula/dracula-ui';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Puff } from 'react-loading-icons'

const API_MALHAS = "https://servicodados.ibge.gov.br/api/v3/malhas/municipios/"
const API_MUNICIPIOS = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function Surpreenda() {
    const [image, setImage] = useState("")
    const [allCities, setAllCities] = useState([])
    const [myCity, setMyCity] = useState("")
    
    async function handle() {

        const metadados = allCities[getRandomInt(0, allCities.length)];
        if (metadados.id > 0) {
            const svg = await (await fetch(API_MALHAS + metadados.id + "?preenchimento=E0E0E0")).blob()
            const doc = URL.createObjectURL(svg)
            console.log(metadados)
            setMyCity(metadados.nome + " " + metadados.microrregiao.mesorregiao.UF.sigla)
            setImage(doc)
        }
    }

    useEffect(() => {
        async function preload(){
            const all = await (await fetch(API_MUNICIPIOS)).json()
            setAllCities(all);
            handle();
        }
        preload();
    }, []);

    return (
        <section>

            <div className='container-app'>
                {image ?
                    <Box>
                        <Heading>{myCity}</Heading>
                        <div style={{ margin: "20px auto" }}>
                            <img alt="Me" width="100%" src={image} />
                        </div>
                        <Box style={{ position: "fixed", bottom: "10px", left: "0", width: "100%" }}>
                            <Link to={`/`}>
                                <Button color="blackLight" m="sm">
                                    Voltar
                            </Button>
                            </Link>
                               <Button color="yellowPink" m="sm"
                               onClick={handle}>
                                    De novo
                            </Button>
                           
                        </Box>

                    </Box>
                    : <><Puff stroke="pink" strokeOpacity={.925} speed={.75} /></>
                }
            </div>
        </section>
    )
}

export default Surpreenda;