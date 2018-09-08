import React, { Component } from 'react';
import { Input, Button, Select } from 'antd';
import './App.css';
import Plot from 'react-plotly.js';

import worker from 'workerize-loader!./worker'; // eslint-disable-line

let instance

class App extends Component {
  state = {
    start: '1',
    end: '4',
    degree: '3',
    precision: '0.001',
    func: 'sin(x)',
    xRange: [],
    functionPlot: {
      y: []
    },
    approximationPlot: {
      y: []
    },
    // x: [],
    // y: [],
    disableTerminateWorkerButton: true
  }

  constructor() {
    super()
  }

  caclulate = () => {
    const {start, end, degree, precision, func} = this.state;

    this.setState({x: [], y: [], disableTerminateWorkerButton: false})
    instance = worker()
    instance.onmessage = ({data}) => {
      let iterationData;
      try {
        iterationData = JSON.parse(data)
        console.log(iterationData)
                    
        const x = (this.state.x[this.state.x.length - 1] || 0) + 1
        const y = Math.abs(iterationData.maxError)
        if (iterationData.functionPlot) {
          this.setState({
            xRange: iterationData.xRange,
            functionPlot: {y: iterationData.functionPlot.y},
            approximationPlot: {y: iterationData.approximationPlot.y}
            // x: iterationData.xRange,
            // y: iterationData.functionPlot.y
          })   
        }
        // this.setState({
        //   x: [...this.state.x, x],
        //   y: [...this.state.y, y]
        // })
      } catch (err) {
        console.log(err)
      }
    }
    instance.postMessage({start: +start, end: +end, degree: +degree, precision: +precision, func})
  }

  render() {
    const {start, end, degree, precision, func} = this.state;
    return (
      <div className="App">
        <h1>Мінімаксне наближення</h1>
        <div className="control" >
          <Input
            type="number"
            addonBefore="Start"
            placeholder="Start"
            value={start}
            onChange={e => this.setState({start: +e.target.value})} />
        </div>
        <div className="control">
          <Input
            type="number"
            addonBefore="End"
            placeholder="End"
            value={end}
            onChange={e => this.setState({end: +e.target.value})} />
        </div>
        <div className="control">
          <span style={{marginRight: '10px'}}>Degree:</span> 
          <Select
            defaultValue="1"
            onChange={value => this.setState({degree: +value})}>
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
            <Select.Option value="3">3</Select.Option>
            <Select.Option value="4">4</Select.Option>
            <Select.Option value="5">5</Select.Option>
          </Select>
        </div>
        <div className="control">
          <Input
            type="number"
            addonBefore="Precision"
            placeholder="Precision"
            value={precision}
            onChange={e => this.setState({precision: +e.target.value})} />
        </div>
        <div className="control">
          <Input
            type="text"
            addonBefore="Function"
            placeholder="Function"
            value={func}
            onChange={e => this.setState({func: e.target.value})} />
        </div>
        <Button onClick={this.caclulate}>Calculate</Button>
        {/* <Button onClick={() => this.setState({x: [...this.state.x, this.state.x[this.state.x.length - 1] + 1], y: [...this.state.y, Math.random() * 10]})}>Add random point</Button> */}
        <Button disabled={this.state.disableTerminateWorkerButton} onClick={() => instance.terminate()}>Stop worker</Button>

        <div>
          <Plot
            useResizeHandler={true}
            style={{width: '100%', height: '100%'}}
            data={[{
                x: this.state.xRange,
                y: this.state.functionPlot.y,
                type: 'scatter',
                mode: 'lines+points',
                marker: {color: 'red'},
              },
              {
                x: this.state.xRange,
                y: this.state.approximationPlot.y,
                type: 'scatter',
                mode: 'lines+points',
                marker: {color: 'blue'},
              }
            ]}
            layout={ {
              autosize: true,
              title: 'A Fancy Plot',
              margin: {
                l: 50,
                // t: 0,
                // b: 0,
                // r: 0
              }
            }
           }
          />
        </div>
      </div>
    );
  }
}

export default App;
