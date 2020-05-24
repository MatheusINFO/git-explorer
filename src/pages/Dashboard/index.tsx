import React, {useState, useEffect, FormEvent} from 'react';
import {Link} from 'react-router-dom';
import {FiChevronRight} from 'react-icons/fi';

import {Title, Form, Error, Repositories} from './styles';
import api from '../../services/api';
const logoImg = require('../../assets/logo.svg') as string;

interface Repository{
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
}

// React Function component
const Dashboard: React.FC = () => {
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if(storageRepositories){
            return JSON.parse(storageRepositories);
        }else{
            return [];
        }
    });
    const [inputError, setInputError] = useState('');
    const [newRepo, setNewRepo] = useState('');

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories]);

    const handleAddRepository = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!newRepo){
            setInputError('Digite o autor/nome do repositório');
            return;
        }

        try{
            const response = await api.get(`/repos/${newRepo}`);
            const repository = response.data;

            setRepositories([...repositories, repository]);
            setNewRepo("");
            setInputError("");
        }catch(error){
            setInputError('Erro na busca por esse repositório');
        }
    }

    return(
        <>
            <img src={logoImg} alt="Github explorer"/>
            <Title>Explore repositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    type="text"
                    placeholder="Digite o nome do repositório"
                    value={newRepo}
                    onChange={e => setNewRepo(e.target.value)}
                />
                <button type="submit">Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login}/>

                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>

                        <FiChevronRight size={20}/>
                    </Link>
                ))}
            </Repositories>
        </>
    )
}

export default Dashboard;
