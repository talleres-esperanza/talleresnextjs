const { gql, default: request } = require("graphql-request");

const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const uploadAsset = async (file) => {
  try {
    // Paso 1: Crear el asset en Hygraph
    const createAssetMutation = gql`
      mutation CreateAsset($fileName: String!) {
        createAsset(data: { fileName: $fileName }) {
          id
          upload {
            requestPostData {
              url
              key
              policy
              signature
              algorithm
              credential
              securityToken
              date
            }
          }
        }
      }
    `;

    const createAssetResponse = await request(
      HYGRAPH_ENDPOINT,
      createAssetMutation,
      { fileName: file.name }
    );

    const { id, upload } = createAssetResponse.createAsset;
    const { requestPostData } = upload;

    // Paso 2: Subir el archivo directamente a S3
    const formData = new FormData();
    formData.append("key", requestPostData.key);
    formData.append("policy", requestPostData.policy);
    formData.append("X-Amz-Signature", requestPostData.signature);
    formData.append("X-Amz-Algorithm", requestPostData.algorithm);
    formData.append("X-Amz-Credential", requestPostData.credential);
    formData.append("X-Amz-Security-Token", requestPostData.securityToken);
    formData.append("X-Amz-Date", requestPostData.date);
    formData.append("file", file);

    const uploadResponse = await fetch(requestPostData.url, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error("Error al subir el archivo a S3");
    }

    // Paso 3: Publicar el asset
    const publishMutation = gql`
      mutation PublishAsset($id: ID!) {
        publishAsset(where: { id: $id }) {
          id
          url
        }
      }
    `;

    const publishResult = await request(HYGRAPH_ENDPOINT, publishMutation, {
      id,
    });

    return publishResult.publishAsset.url;
  } catch (error) {
    console.error("Error en uploadAsset:", error);
    throw error;
  }
};




const GetAprendices = async () => {
  const query = gql`
    query Clientes {
      clientes {
        id
        nombre
        foto {
          url
        }
        tieneValera
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const GetTipoClientes = async () => {
  const query = gql`
    query GetTiposCliente {
      tipoClientes {
        nombre
        id
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const createClient = async (clientData) => {
  const mutation = gql`
    mutation CreateClient(
      $nombre: String!
      $tipoClienteId: ID!
      $documento: String!
      $tieneValera: TieneValera!
    ) {
      createCliente(
        data: {
          nombre: $nombre
          tipoCliente: { connect: { id: $tipoClienteId } }
          documento: $documento
          tieneValera: $tieneValera
        }
      ) {
        id
      }
    }
  `;

  const publishMutation = gql`
    mutation PublishClient($id: ID!) {
      publishCliente(where: { id: $id }) {
        id
      }
    }
  `;

  const variables = {
    nombre: clientData.nombre,
    tipoClienteId: clientData.tipoClienteId,
    documento: clientData.documento.toString(),
    tieneValera: clientData.valera,
  };

  // Crear el cliente
  const { createCliente } = await request(MASTER_URL, mutation, variables);

  // Publicar el cliente
  await request(MASTER_URL, publishMutation, { id: createCliente.id });

  return createCliente.id;
};

const GetPedidos = async (fecha) => {
  const query = gql`
    query GetPedidos {
      pedidos(where: { fecha: "`+fecha+`" }) {
        id
        producto {
          id
          nombre
          imagen {
            url
          }
        }
        aprendice {
          id
          nombre
          foto {
            url
          }
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const createPedido = async (pedidoData) => {
  // 1. Crear el pedido
  const createQuery = gql`
    mutation {
      createPedido(
        data: {
          aprendice: { connect: { id: "${pedidoData?.persona?.id}" } }
          producto: { connect: { id: "${pedidoData?.combo?.id}" } }
          fecha: "${pedidoData?.fecha}"
        }
      ) {
        id
      }
    }
  `;

  const createResult = await request(MASTER_URL, createQuery);
  const pedidoId = createResult?.createPedido?.id;

  // 2. Publicar el pedido creado
  if (pedidoId) {
    const publishQuery = gql`
      mutation {
        publishPedido(where: { id: "${pedidoId}" }, to: PUBLISHED) {
          id
          stage
        }
      }
    `;

    const publishResult = await request(MASTER_URL, publishQuery);
    console.log("Pedido publicado:", publishResult);
    return publishResult;
  } else {
    throw new Error("No se pudo crear el pedido");
  }
};

const getProductos = async () => {
  const query = gql`
    query productos {
      productos {
        id
        imagen {
          url
        }
        nombre
        tipoProducto {
          nombre
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

export default {
  GetAprendices,
  getProductos,
  createClient,
  GetTipoClientes,
  createPedido,
  GetPedidos,
  uploadAsset,
};
