import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Button, Heading } from '@dracula/dracula-ui'
import Puff from 'react-loading-icons/dist/components/puff';

const API = "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?preenchimento=E0E0E0"

function Home() {
    const [image, setImage] = useState("")

    useEffect(() => {
        async function handle() {
            const svg = await (await fetch(API)).blob()
            const doc = URL.createObjectURL(svg)
            setImage(doc)
        }
        handle();
    }, []);

    return (
        <div className='container-app'>
            <Heading>Onde eu estou no brasil?</Heading>
            {image ?
                <Box>
                    <div style={{ margin: "20px auto"}}>
                        <img width="100%" src={image} />
                    </div>
                    <Link to={`/where/`}>
                        <Button color="pinkPurple" m="sm">
                            Iniciar
                    </Button>
                    </Link>
                </Box>
                    : <><Puff stroke="pink" strokeOpacity={.925} speed={.75} /></>
                }
        </div>
    )
}

export default Home;