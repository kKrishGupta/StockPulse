import { 
  fetchStockData, 
  saveStockData, 
  fetchStockHistory,
  getTopGainers as getTopGainersService,
  getTopLosers as getTopLosersService,
  getStocks 
} from "../services/stock.service.js";

export const getStockData = async(req ,res) =>{
  
  try{
    const { symbol } = req.params;
    const data = await fetchStockData(symbol);
    const saved = await saveStockData(data);
    res.json({
      success : true,
      data : saved || data // Return saved data if it was new, otherwise return fetched data
    });
  }catch(error){
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

export const getStockHistory = async(req ,res) =>{
  try{
    const { symbol } = req.params;
    const history = await fetchStockHistory(symbol);
    res.json({
      success : true,
      count : history.length,
      data : history
    });
  }catch(error){
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

export const getTopGainers = async(req ,res) =>{  
  try{
    const gainers = await getTopGainersService();
    res.json({
      success : true,
      count : gainers.length,
      data : gainers
    });
  }catch(error){
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

export const getTopLosers = async(req ,res) =>{
  try{
    const losers = await getTopLosers();
    res.json({
      success : true,
      count : losers.length,
      data : losers
    });
  }
  catch(error){
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

export const getAllStocks = async(req,res) =>{
  try{
    const {page , limit , symbol} = req.query;
    const result = await getStocks({
      page: parseInt(page) || 1,
      limit : parseInt(limit) ||10,
       symbol
      });
    res.json({
      success : true,
      count : result.length,
      data : result
    });
  }
  catch(error){
    res.status(500).json({
      success : false,
      message : error.message
    });
  } 
}