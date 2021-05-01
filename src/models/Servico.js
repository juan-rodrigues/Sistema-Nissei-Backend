const Carro=require('./Carro');
const Funcionario=require('./Funcionario');
const Cliente=require('./Cliente');
const ServicoPeca=require('./ServicoPeca');
const ServicoDAO=require('../DAOs/ServicoDAO');
module.exports=class Servico{
    constructor(cod,carro,cliente,funcionario,descricao,maoObra,inicio,status){
        this.ser_cod=cod;
        this.carro=carro;
        this.cliente=cliente;
        this.funcionario=funcionario;
        this.ser_descricao=descricao;
        this.ser_maoObra=maoObra;
        this.ser_total=0;
        this.ser_status=status;
        this.ser_inicio=inicio;
        this.ser_saida=null;
        this.pecas=[];
    }
    getCod(){
        return this.ser_cod;
    }
    getCarro(){
        return this.carro;
    }
    getCliente(){
        return this.cliente;
    }
    getFuncionario(){
        return this.funcionario;
    }
    getDescricao(){
        return this.ser_descricao;
    }
    getMaoObra(){
        return this.ser_maoObra;
    }
    getInicio(){
        return this.ser_inicio;
    }
    getStatus(){
        return this.ser_status;
    }
    getPecas(){
        return this.pecas;
    }
    addPecaLista(peca){
        this.pecas.push(peca);
    }
    setPecas(pecas){
        this.pecas=pecas;
    }
    setTotal(total){
        this.total=total;
    }
    async gravar(db) {
        const resp=await new ServicoDAO().gravar(this,db);
        this.ser_cod=resp.lastId; 
    }
    async alterar(db){
        await new ServicoDAO().alterar(this,db);
    }
    async procurarCod(cod,db){
        const resp=await new ServicoDAO().procurarCod(cod,db);
        let carro=null;
        let funcionario=null;
        if(resp.data[0].car_id!=null)
            carro=await new Carro().procurarCod(resp.data[0].car_id,db);
        if(resp.data[0].fun_cod!=null)
            funcionario=await new Funcionario().procurarCod(resp.data[0].fun_cod,db);
        let servico=new Servico(resp.data[0].ser_cod,carro,await (new Cliente().procurarCod(resp.data[0].cli_cod,db)),
                        funcionario,resp.data[0].ser_descricao,resp.data[0].ser_maoObra,
                        resp.data[0].ser_status);
        servico.setPecas(await (new ServicoPeca().listar(cod,db)));
        servico.calcularTotal();
        return servico;
    }
    async listarFiltros(cli_nome,dt_inicio,dt_saida,car_placa,status,db){
        const sers = await new ServicoDAO().listarFiltros(cli_nome,dt_inicio,dt_saida,car_placa,status,db);
        let servicos=[];
        let carro=null;
        let cliente=null;
        let funcionario=null;
        for(let i=0;i<sers.data.length;i++){
            if(sers.data[i].car_id!=null)
                carro=await new Carro().procurarCod(sers.data[i].car_id,db);
            if(sers.data[i].fun_cod!=null)
                funcionario=await new Funcionario().procurarCod(sers.data[i].fun_cod,db);
            cliente=await new Cliente().procurarCod(sers.data[i].cli_cod,db);

            servicos.push(
                new Servico(sers.data[i].ser_cod,
                            carro,
                            cliente,
                            funcionario,
                            sers.data[i].ser_descricao,
                            sers.data[i].mao_obra,
                            sers.data[i].ser_inicio,
                            sers.data[i].ser_status)
            )
            carro=null;
            cliente=null;
            funcionario=null;
        }
        return servicos;
    }
    calcularTotal(){
        this.total=this.ser_maoObra;
        for(let i=0;i<this.pecas.length;i++){
            this.total+=this.pecas[i].getTotal();
        }
    }
}