// backend/diagnostic.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

async function diagnostic() {
  console.log('🔍 DIAGNÓSTICO DO SUPABASE\n');
  console.log('📁 Diretório atual:', __dirname);
  console.log('🔧 Carregando variáveis de ambiente...\n');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  // Verificação 1: Variáveis existem?
  console.log('1. ✅ Variáveis de ambiente:');
  console.log('   SUPABASE_URL:', supabaseUrl ? `✓ (${supabaseUrl.length} chars)` : '✗ FALTANDO');
  console.log('   SUPABASE_SERVICE_KEY:', supabaseKey ? `✓ (${supabaseKey.length} chars)` : '✗ FALTANDO');

  if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ ERRO: Variáveis de ambiente não configuradas!');
    console.log('\n💡 SOLUÇÃO:');
    console.log('   Crie um arquivo .env na pasta backend com:');
    console.log('   SUPABASE_URL=https://seu-projeto.supabase.co');
    console.log('   SUPABASE_SERVICE_KEY=sua_chave_muito_longa_aqui');
    console.log('   PORT=5000');
    return;
  }

  // Verificação 2: Formato da URL
  console.log('\n2. 🔗 Formato da URL:');
  if (!supabaseUrl.includes('supabase.co')) {
    console.log('   ❌ URL não parece ser do Supabase:', supabaseUrl);
  } else {
    console.log('   ✓ URL parece válida');
    console.log('   📋 URL:', supabaseUrl);
  }

  // Verificação 3: Formato da Key
  console.log('\n3. 🔑 Formato da Service Key:');
  if (!supabaseKey.startsWith('eyJ')) {
    console.log('   ❌ Key não começa com "eyJ" - formato JWT inválido');
    console.log('   🔑 Primeiros 20 caracteres:', supabaseKey.substring(0, 20));
  } else {
    console.log('   ✓ Formato JWT parece válido');
    console.log('   🔑 Primeiros 20 caracteres:', supabaseKey.substring(0, 20) + '...');
  }

  // Verificação 4: Teste de conexão
  console.log('\n4. 🚀 Testando conexão...');
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    console.log('   ⏳ Fazendo requisição...');
    
    const { data, error } = await supabase
      .from('leads')
      .select('id, name')
      .limit(1);

    if (error) {
      console.log('   ❌ Erro na consulta:', error.message);
      console.log('   📟 Código do erro:', error.code);
      
      if (error.message.includes('JWT')) {
        console.log('   💡 Service Key inválida ou expirada');
      } else if (error.message.includes('PGRST301')) {
        console.log('   💡 Tabela "leads" não existe');
      } else if (error.message.includes('relation')) {
        console.log('   💡 Tabela não encontrada no banco de dados');
      }
    } else {
      console.log('   ✅ Conexão bem-sucedida!');
      console.log('   📊 Dados recebidos:', data);
    }

  } catch (err) {
    console.log('   ❌ Erro de conexão:', err.message);
    
    if (err.message.includes('fetch')) {
      console.log('   💡 Erro de rede/fetch. Possíveis causas:');
      console.log('      - URL do Supabase incorreta');
      console.log('      - Projeto não existe ou foi deletado');
      console.log('      - Service Key inválida');
      console.log('      - Bloqueio de firewall/proxy');
      console.log('      - Problema de DNS');
    }
  }

  console.log('\n📋 PRÓXIMOS PASSOS:');
  console.log('1. Verifique se o projeto existe em: https://supabase.com/dashboard');
  console.log('2. Confirme a URL exata no Settings > API');
  console.log('3. Use a SERVICE KEY (não a anon key)');
  console.log('4. Verifique se o projeto não está pausado');
  console.log('\n🔧 SOLUÇÃO TEMPORÁRIA:');
  console.log('   Use dados mock executando: node app/server.js');
}

diagnostic();