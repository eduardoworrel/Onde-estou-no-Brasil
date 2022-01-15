import { Box, Button, Heading } from '@dracula/dracula-ui';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Puff } from 'react-loading-icons'

const API_IP = "http://localhost:5001/getByIP"
const API_MALHAS = "https://servicodados.ibge.gov.br/api/v3/malhas/municipios/"
const API_MUNICIPIOS = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
function Where() {
    const [image, setImage] = useState("")
    const [myCity, setMyCity] = useState("")

    useEffect(() => {

        async function handle() {
            const { status, Mensage} = await (await fetch(API_IP)).json()
            const city = Mensage;
            if (city) {
                const all = await (await fetch(API_MUNICIPIOS)).json()
                const [metadados] = all.filter((e) => e.nome === city);
                if (metadados.id > 0) {
                    const svg = await (await fetch(API_MALHAS + metadados.id + "?preenchimento=E0E0E0")).blob()
                    const doc = URL.createObjectURL(svg)
                    setMyCity(city)
                    setImage(doc)
                }
            }
        }
        handle();
    }, []);

    return (
        <section>
            <div className='container-app'>
                {myCity ?
                    <Box>
                        <Heading>{myCity}</Heading>
                        <div style={{ margin: "0 auto", width: "30%" }}>
                            <img alt="Me" width="100%" src={image} />
                        </div>
                        <Link to={`/`}>
                            <Button color="blackLight" m="sm">
                                Voltar
                            </Button>
                        </Link>
                        <Link to={`/erramos/`}>
                            <Button color="yellowPink" m="sm">
                                Erramos?
                            </Button>
                                </Link>
                            </Box>
                    : <><Puff stroke="pink" strokeOpacity={.925} speed={.75} /></>
                }
            </div>
        </section>
    )
}

export default Where;