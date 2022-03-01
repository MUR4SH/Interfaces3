import classes from './App.css'
import React, { useEffect, useState } from 'react'

const MatrixInput = ({
    rows,
    columns,
    value: initialValue,
    setValue: setInitialValue,
    className
}) => {
    const [value, setValue] = useState('')
    const [isValid, setIsValid] = useState(true)
    const [touched, setTouched] = useState(false)
    const parseValue = (value) => {
        return value.map(row => row.join(' ')).join('\n')
    }

    const processValue = (value) => {
        return value.split('\n').map(
            row => row.split(' ').map(
                num => {
                    const result = parseFloat(num)
                    return !isNaN(result) ? result : num
                }))
    }

    const validate = (value) => {
        const currentRows = value.split('\n')
        if (rows && currentRows.length !== rows) {
            return false
        }
        if (columns && !currentRows.every(row => row.split(' ').length === columns)) {
            return false
        }
        if (!currentRows.every(row => row.split(' ').every(num => num.match(/^(\d+[.,])?\d+$/)))) {
            return false
        }
        return true
    }

    useEffect(() => {
        if (!Array.isArray(initialValue)) {
            setValue('')
        } else {
            const value = parseValue(initialValue)
            setValue(value)
            const isValid = validate(value)
            setIsValid(isValid)
        }
    }, [initialValue])

    const onBlur = () => {
        !touched && setTouched(true)
        const isValid = validate(value)
        setIsValid(isValid)
        if (value && setInitialValue) {
            setInitialValue(processValue(value))
        }
    }

    const changeHandler = ({ target }) => {
        setValue(target.value)
    }

    return (
        <textarea
            className={`${touched && !isValid ? classes.hasError : ''} ${className}`}
            value={value}
            onChange={changeHandler}
            onBlur={onBlur}
        />
    )
}

const App = () => {
    const [size, setSize] = useState(5)
    const [vector, setVector] = useState([])
    const [W, setW] = useState([])
    const [V, setV] = useState([])
    const [Net1, setNet1] = useState([])
    const [Net2, setNet2] = useState([])
    const [Out1, setOut1] = useState([])
    const [Out2, setOut2] = useState([])
    const autoSetup = () => {
        if (vector.length && vector.length !== size) {
            const value = vector[0][0]
            setVector(Array.from({ length: size }).fill([value]))
        }
        const createMatrix = (value) => {
            const row = Array.from({ length: size }).fill(value)
            return Array.from({ length: size }).fill(row)
        }
        if (W.length && W.length !== size) {
            const value = W[0][0]
            setW(createMatrix(value))
        }
        if (V.length && V.length !== size) {
            const value = V[0][0]
            setV(createMatrix(value))
        }
    }

    const computeNet = (vector, matrix) => {
        if (vector.length !== size || matrix.length !== size) return []
        const result = Array.from({ length: vector.length }).fill(0)
        for (let i = 0; i < vector.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                const vecElem = vector[i]
                const matrElem = matrix[j][i]
                if (typeof vecElem !== 'number' || typeof matrElem !== 'number') return []
                result[i] += vecElem * matrElem
            }
        }
        return result
    }

    const computeOut = (net) => {
        return net.map(num => 1 / (1 + Math.pow(Math.E, -num)))
    }

    useEffect(() => {
        setNet1(computeNet(vector.map(([num]) => num), W))
    }, [vector, W])
    useEffect(() => {
        setOut1(computeOut(Net1))
    }, [Net1])
    useEffect(() => {
        setNet2(computeNet(Out1, V))
    }, [Out1, V])
    useEffect(() => {
        setOut2(computeOut(Net2))
    }, [Net2])

    const ResultColumn = ({ title, result }) => {
        return (
            <div className='result'>
                <div className='result__title'>{title}</div>
                <div className='result__table'>
                    {result.map(num => <div className='result__table__element'>{parseFloat(num.toFixed(4))}</div>)}
                </div>
            </div>
        )
    }

    return (
        <>
            <h2>Реализация матричной модели обработки информации в искусственных нейрон
                ный сетях</h2>
            <p>Разработчики:</p>
            <ul>
                <li>Мурашев А.С.</li>
                <li>Иванов Д.С.</li>
                <li>Передерий В.А.</li>
                <li>Капырин К.А.</li>
            </ul>
            <hr />
            <div className='main__body'>
                <div className='init'>
                    <div>Вектор</div>
                    <MatrixInput
                        rows={5}
                        columns={1}
                        className={`${classes.matrix} ${classes.vector}`}
                        value={vector}
                        setValue={setVector}
                    />
                </div>
                <div className='main__block'>
                    <div className='main__init_block'>
                        <div className='result__title'> Матрица W </div>
                        <MatrixInput
                            rows={5}
                            columns={5}
                            value={W}
                            setValue={setW}
                        />
                    </div>
                    <div className='main__result__block'>
                        <ResultColumn title='NET1' result={Net1} />
                        <ResultColumn title='OUT1' result={Out1} />
                    </div>
                </div>
                <div className='main__block'>
                    <div className='main__init_block'>
                        <div className='result__title'> Матрица W </div>
                        <MatrixInput
                            rows={5}
                            columns={5}
                            value={V}
                            setValue={setV}
                        />
                    </div>
                    <div className='main__result__block'>
                        <ResultColumn title='NET2' result={Net1} />
                        <ResultColumn title='OUT2' result={Out1} />
                    </div>
                </div>
                <div className={classes.offsetWrapper}>
                    <span>Размер</span>
                    <input
                        type='number'
                        className={classes.sizeInput}
                        min={1}
                        value={size}
                        onChange={({ target }) => { setSize(target.value) }}
                    />
                    <button onClick={autoSetup}>Заполнить автоматически</button>
                </div>
            </div>

        </>
    )
}


export default App