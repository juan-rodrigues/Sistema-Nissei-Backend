const axios = require('axios');
//const mysql = require('mysql2/promise');
const db = require('../models/Database');

module.exports={
    async gravar(request,response) {
 
        const {car_id,pes_cod,ser_descricao,ser_maoObra,ser_inicio,ser_fim,ser_total,ser_status} = request.body;
       
        //verificar se o professor ja esta cadastrado
        const con = await db.conecta();
        const sql = "INSERT INTO servico (car_id,pes_cod,ser_descricao,ser_maoObra,ser_inicio,ser_fim,ser_total,ser_status) VALUES (?, ?, ?, ?, ?, ?,?,?)";
        
        const valor = [car_id,pes_cod,ser_descricao,ser_maoObra,ser_inicio,ser_fim,ser_total,ser_status];
        const result = await db.manipula(sql,valor);
        
        return response.json(result);
    },
    async alterar(request,response){
        const {ser_cod,car_id,pes_cod,ser_descricao,ser_maoObra,ser_inicio,ser_fim,ser_total,ser_status} = request.body;
    
      
        const con = await db.conecta();
        const sql = "UPDATE servico SET car_id=?,pes_cod=? ,"+
                    "ser_descricao=?,ser_maoObra=?,ser_inicio=?,ser_fim=?, "+
                    "ser_total=?,ser_status=? "+
                    "WHERE ser_cod = ?";
        
        const valor = [car_id,pes_cod,ser_descricao,ser_maoObra,ser_inicio,ser_fim,ser_total,ser_status,ser_cod];
        const result = await db.manipula(sql,valor);
        return response.json(result);
    },
    async procurarServico(request,response){
        const {cod} = request.params;
        const con = await db.conecta();
        const sql = "SELECT * FROM servico WHERE ser_cod=?";
        
        const valor = [cod];
        const result = await db.consulta(sql,valor);

        return response.json(result.data);
    },
    async listarPorCliente(request,response){
        const {cod} = request.params;
        const con = await db.conecta();
        const sql = "SELECT * FROM servico where pes_cod=?";
        const valor = [cod];
        const sers = await db.consulta(sql,valor);
        return response.json(sers.data);
    },
    async listarPorCarro(request,response){
        const {cod} = request.params;
        const con = await db.conecta();
        const sql = "SELECT * FROM servico where car_id=?";
        const valor = [cod];
        const sers = await db.consulta(sql,valor);
        return response.json(sers.data);
    },
    async listarPorData(request,response){
        const {datainicio} = request.params;
        const {datafim} = request.params;
        const con = await db.conecta();
        const sql = "SELECT * FROM servico where CURRENT_DATE()>="+datainicio+ " AND CURRENT_DATE()<="+datafim;
        const valor = [cod];
        const sers = await db.consulta(sql,valor);
        return response.json(sers.data);
    }
}