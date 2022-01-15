import { Box, Button, Heading } from '@dracula/dracula-ui';
import { useEffect, useState } from 'react';
import Puff from 'react-loading-icons/dist/components/puff';
import { Link } from 'react-router-dom';

const API = "http://localhost:5001/getByGeocode"
const API_MALHAS = "https://servicodados.ibge.gov.br/api/v3/malhas/municipios/"
const API_MUNICIPIOS = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"

function Erramos() {

    const [isLoading, setIsLoading] = useState(true)
    const [naoPermitido, setNaoPermitido] = useState(false)
    const [myCity, setMyCity] = useState(false)
    const [image, setImage] = useState("")

    useEffect(() => {

        async function handle() {
            navigator.geolocation.getCurrentPosition(async (position, erros) => {

                if (erros) {
                    setIsLoading(false);
                    setNaoPermitido(true);
                }

                const lat = position.coords.latitude

                const lon = position.coords.longitude
                const geocodeFormated = `${lat}, ${lon}`;

                const {Mensage} = await (await fetch(API + geocodeFormated)).json()
                const city = Mensage.result[0].locations.adminArea5;
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

            });

        }
        handle();
    }, []);

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
                    <></>
            }
            {
                naoPermitido ?
                    <Box>
                        <Heading>Localização não disponibilizada ;/</Heading>

                    </Box>
                    :
                    <></>
            }
            <Box>
                <Link to={`/`}>
                    <Button color="blackLight" m="sm">
                        Voltar
                    </Button>
                </Link>
            </Box>
        </div>
    );
}

export default Erramos