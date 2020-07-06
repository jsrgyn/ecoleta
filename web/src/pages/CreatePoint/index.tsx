import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';
import { LeafletMouseEvent, LeafletEvent } from 'leaflet';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone';

import './styles.css';

import logo from '../../assets/logo.svg';

// array ou objeto: manualmente informar o tipo da variavel

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
    // return <h1>Hello Planet</h1>;

    // const [items, setItems] = useState([]);
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [InitialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [selectedUf, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    })

    // useEffect(() => {}, []);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);

            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude]);
        })
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            console.log(response);
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            console.log(response);
            const ufInitials = response.data.map(uf => uf.sigla);

            console.log(ufInitials);

            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        //carregar as cidades sempre que a UF mudar
        if (selectedUf === '0') {
            console.log('A UF não mudou.')
            return;
        }
        console.log('A UF mudou', selectedUf);

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            console.log(response);

            const cityNames = response.data.map(city => city.nome);

           console.log(cityNames);

            setCities(cityNames);
        });

    }, [selectedUf]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
      console.log('Teste');
      console.log(event.target.value);

      const uf = event.target.value;
      setSelectedUF(uf);
    };

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        console.log('Teste Cidade');
        console.log(event.target.value);
  
        const city = event.target.value;
        setSelectedCity(city);
      };

      function handleMapClick(event: LeafletMouseEvent ) {
          console.log(event.latlng);
          setSelectedPosition([
              event.latlng.lat,
              event.latlng.lng,
          ])

      };

      function handleImputChage(event: ChangeEvent<HTMLInputElement>) {
        console.log(event);
        console.log(event.target.name, event.target.value);
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value});
      }

      function handleSelecitItem(id: number) {
          console.log('teste', id);
        // setSelectedItems([id]);
        const alreadySelected = selectedItems.findIndex(item => item === id); 

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }
      }

      async function handleSubmit(event: FormEvent){
          console.log('OnSubmit');
          event.preventDefault();

          console.log(selectedFile);
        //   return;

          const { name, email, whatsapp } = formData;
          const uf = selectedUf;
          const city = selectedCity;
          const [latitude, longitude] = selectedPosition;
          const items = selectedItems;

        //   const data = {
        //       name,
        //       email,
        //       whatsapp,
        //       uf,
        //       city,
        //       latitude,
        //       longitude,
        //       items
        //   };

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));

        if (selectedFile) {
            data.append('image', selectedFile)
        }
        console.log(data);
         
         await api.post('points', data);

          alert('Ponto de coleta criado!');

          history.push('/');
      }

    return (
      <div id="page-create-point">
          <header>
              <img src={logo} alt="Ecoleta"/>

              <Link to="/">
                  <FiArrowLeft />
                  Voltar para home
              </Link>
          </header>

          {/* <form> */}
          <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                          type="text"
                          name="name"
                          id="name"
                          onChange={handleImputChage}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                            type="email"
                            name="email"
                            id="emial"
                            onChange={handleImputChage}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleImputChage}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Enderço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    {/* <Map center={[-27.2092052, -49.6401092]} zoom={15} onclick={handleMapClick}>  */}
                    <Map center={InitialPosition} zoom={15} onclick={handleMapClick}>  */}
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* <Marker position={[-27.2092052, -49.6401092]} /> */}
                        <Marker position={selectedPosition} /> 

                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                              name="uf" 
                              id="uf" 
                              value={selectedUf} 
                              onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                              name="city" 
                              id="city"
                              value={selectedCity}
                              onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {/* <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Teste"/>
                            <span>Óleo de Cozinha</span>
                        </li>
                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Teste"/>
                            <span>Óleo de Cozinha</span>
                        </li>
                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Teste"/>
                            <span>Óleo de Cozinha</span>
                        </li>
                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Teste"/>
                            <span>Óleo de Cozinha</span>
                        </li>
                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Teste"/>
                            <span>Óleo de Cozinha</span>
                        </li>
                        <li>
                            <img src="http://localhost:3333/uploads/oleo.svg" alt="Teste"/>
                            <span>Óleo de Cozinha</span>
                        </li> */}

                        {items.map(item => (
                            <li 
                              key={item.id} 
                              onClick={() => handleSelecitItem(item.id)}
                              className={selectedItems.includes(item.id) ? 'selected': ''}    
                            > 
                            <img src={item.image_url} alt={item.title}/>
                            <span>{item.title}</span>
                        </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
          </form>
      </div>
    );
}

export default CreatePoint; 