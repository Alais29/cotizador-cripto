import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import useMoneda from '../hooks/useMoneda'
import useCriptomoneda from '../hooks/useCriptomoneda'
import Error from './Error'
import axios from 'axios'
import PropTypes from 'prop-types'

const Boton = styled.input`
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  background-color: #66a2fe;
  border: none;
  width: 100%;
  border-radius: 10px;
  color: #fff;
  transition: background-color 0.3s ease-in-out;
  &:hover {
    background-color: #326ac0;
    cursor: pointer;
  }
`

const Formulario = ({ guardarMoneda, guardarCriptomoneda }) => {
  //state de la lista de criptomonedas
  const [listacripto, guardarListacripto] = useState([])
  const [error, guardarError] = useState(false)

  const MONEDAS = [
    {codigo: 'USD', nombre: 'Dolar de Estados Unidos'},
    {codigo: 'MXN', nombre: 'Peso Mexicano'},
    {codigo: 'EUR', nombre: 'Euro'},
    {codigo: 'GBP', nombre: 'Libra Esterlina'},
    {codigo: 'CLP', nombre: 'Peso Chileno'},
  ]

  // Utilizar useMoneda y useCriptomoneda
  const [moneda, SelectMonedas] = useMoneda('Elige tu Moneda', '', MONEDAS)
  const [criptomoneda, SelectCripto] = useCriptomoneda('Elige tu Crptomoneda', '', listacripto)

  // Llamado a la API
  useEffect(() => {
    const consultarAPI = async () => {
      const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'
      const resultado = await axios.get(url);
      guardarListacripto(resultado.data.Data);
    }
    consultarAPI()
  }, [])

  // Al hacer submit
  const cotizarMoneda = e => {
    e.preventDefault();
    //validar si ambos campos estan llenos
    if (!moneda || !criptomoneda) {
      guardarError(true)
      return
    }

    //pasar los datos al componente principal
    guardarError(false)
    guardarMoneda(moneda)
    guardarCriptomoneda(criptomoneda)
  }

  return (
    <form
      onSubmit={cotizarMoneda}
    >
      {error && <Error mensaje="Todos los campos son obligatorios" />}
      <SelectMonedas />
      <SelectCripto />
      <Boton
        type="submit"
        value="Calcular"
      />
    </form>
  )
}

Formulario.propTypes = {
  guardarMoneda: PropTypes.func.isRequired,
  guardarCriptomoneda: PropTypes.func.isRequired
}

export default Formulario