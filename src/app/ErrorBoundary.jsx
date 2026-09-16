import React from "react";
import { Brand } from "../components/brand/Brand.jsx";

export class ErrorBoundary extends React.Component {
  state = {
    error: null,
  };
  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }
  render() {
    return this.state.error ? (
      <div className="fatal">
        <Brand />
        <h1>A mochila emperrou.</h1>
        <p>
          Houve um erro ao abrir esta tela. O save continua neste navegador.
        </p>
        <pre>{this.state.error.message}</pre>
        <button className="button primary" onClick={() => location.reload()}>
          Tentar abrir novamente
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
