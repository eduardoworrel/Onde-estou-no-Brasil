import { Box, Button, Heading } from '@dracula/dracula-ui';
import { useEffect, useState } from 'react';
import Puff from 'react-loading-icons/dist/components/puff';
import { Link } from 'react-router-dom';

const API = "https://where-api.eduardoworrel.com/getByGeocode"
const API_MALHAS = "https://servicodados.ibge.gov.br/api/v3/malhas/municipios/"
const API_MUNICIPIOS = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"

function Erramos() {

    const [isLoading, setIsLoading] = useState(true)
    const [naoPermitido, setNaoPermitido] = useState(false)
    const [myCity, setMyCity] = useState(false)
    const [image, setImage] = useState("")


    async function handle() {
        navigator.geolocation.getCurrentPosition(async (position) => {

            const lat = position.coords.latitude

            const lon = position.coords.longitude
            const geocodeFormated = `?lat=${lat}&lon=${lon}`;

            let { Mensage } = await (await fetch(API + geocodeFormated)).json()

            Mensage = JSON.parse(Mensage)

            const city = Mensage.results[0].locations[0].adminArea5;
            if (city) {
                try {
                    const all = await (await fetch(API_MUNICIPIOS)).json()
                    const [metadados] = all.filter((e) => e.nome === city);
                    if (metadados.id > 0) {
                        const svg = await (await fetch(API_MALHAS + metadados.id + "?preenchimento=E0E0E0")).blob()
                        const doc = URL.createObjectURL(svg)
                        setMyCity(city)
                        setImage(doc)
                        setIsLoading(false);
                    }
                } catch (e) {
                    //erramos
                    setIsLoading(false);
                }
            }

        },
            (erros) => {
                if (erros) {
                    setIsLoading(false);
                    setNaoPermitido(true);
                }
            });
    }


    return (
        <div className='container-app'>
            {
                isLoading ?

                    <Box><Puff stroke="pink" strokeOpacity={.925} speed={.75} /></Box>
                    :
                    <></>
            }
            {
                myCity ?
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
                    </Box>
                    :
                    <>
                        <Button
                            onClick={handle} color="pinkPurple" m="sm">
                            Geolocalização
                        </Button>
                        <Link to={`/`}>
                            <Button color="blackLight" m="sm">
                                Voltar
                            </Button>
                        </Link>
                    </>
            }
            {
                naoPermitido ?
                    <>
                        <Box>
                            <Heading>Localização não disponibilizada ;/</Heading>
                        </Box>
                        <Box>
                            <Link to={`/`}>
                                <Button color="blackLight" m="sm">
                                    Voltar
                                </Button> 
                            </Link>
                        </Box>
                    </>
                    :
                    <></>
            }

        </div>
    );
}

export default Erramos