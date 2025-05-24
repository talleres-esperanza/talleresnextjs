const { gql, default: request } = require("graphql-request");

const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const HYGRAPH_TOKEN = process.env.NEXT_PUBLIC_HYGRAPH_SECRET_TOKEN;
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
        url2
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

const GetTipoProductos = async () => {
  const query = gql`
    query GetTipoProductos {
      tipoProductos {
        id
        nombre
        precio
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
      $url2: String!
    ) {
      createCliente(
        data: {
          nombre: $nombre
          tipoCliente: { connect: { id: $tipoClienteId } }
          documento: $documento
          tieneValera: $tieneValera
          url2: $url2
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
    url2: clientData.url2,
  };

  // Crear el cliente
  const { createCliente } = await request(MASTER_URL, mutation, variables);

  // Publicar el cliente
  await request(MASTER_URL, publishMutation, { id: createCliente.id });

  return createCliente.id;
};

const createCombo = async (comboData) => {
  const mutation = gql`
    mutation CreateCombo($nombre: String!, $tipoComboId: ID!, $url2: String!) {
      createProducto(
        data: {
          nombre: $nombre
          tipoProducto: { connect: { id: $tipoComboId } }
          url2: $url2
        }
      ) {
        id
      }
    }
  `;

  const publishMutation = gql`
    mutation PublishCombo($id: ID!) {
      publishProducto(where: { id: $id }) {
        id
      }
    }
  `;

  const variables = {
    nombre: comboData.nombre,
    tipoComboId: comboData.tipoComboId,
    url2: comboData.url2,
  };

  // Crear el combo
  const { createProducto } = await request(MASTER_URL, mutation, variables);

  // Publicar el combo
  await request(MASTER_URL, publishMutation, { id: createProducto.id });

  return createProducto.id;
};

const createTipoProducto = async (tipoProducto) => {
  const mutation =
    gql`
    mutation CreateTipoProducto {
      createTipoProducto(data: { nombre: "` +
    tipoProducto.nombre +
    `", precio: ` +
    tipoProducto.precio +
    ` }) {
        id
      }
    }
  `;

  // Crear el combo
  const { createTipoProducto } = await request(MASTER_URL, mutation);

  const publishMutation =
    gql`
  mutation PublishTipoProducto {
    publishTipoProducto(where: {id:"` +
    createTipoProducto.id +
    `"}) {
      id
    }
  }
`;
  // Publicar el combo
  await request(MASTER_URL, publishMutation);

  return createTipoProducto.id;
};

const updateCombo = async (data) => {
  const mutation =
    gql`
    mutation UpdateCombo {
      updateProducto(
        data: { nombre: "` +
    data.nombre +
    `", tipoProducto: { connect: { id: "` +
    data.idTipoProducto +
    `" } }, url2: "` +
    data.url2 +
    `" }
        where: { id: "` +
    data.id +
    `" }
      ){
    id
  }
    }
  `;

  // Crear el combo
  const { updateProducto } = await request(MASTER_URL, mutation);

  const publishMutation =
    gql`
mutation PublishTipoProducto {
  publishProducto(where: {id:"` +
    updateProducto.id +
    `"}) {
    id
  }
}
`;
  // Publicar el combo
  await request(MASTER_URL, publishMutation);

  return updateProducto;
};

const GetPedidos = async (fecha) => {
  const query =
    gql`
    query GetPedidos {
      pedidos(where: { fecha: "` +
    fecha +
    `" }
      first: 1000
  orderBy: createdAt_DESC) {
        id
        producto {
          id
          nombre
          imagen {
            url
          }
          url2
        }
        aprendice {
          id
          nombre
          foto {
            url
          }
          url2
        }
      }
    }
  `;

  
  const result = await request(MASTER_URL, query);
  console.log(result);
  return result;
};

const updateClient = async (data) => {
  const mutation =
    gql`
    mutation UpdateClient {
      updateCliente(
        data: {
          documento: "` +
    data.documento +
    `"
          nombre: "` +
    data.nombre +
    `"
          tipoCliente: { connect: { id: "` +
    data.tipoClienteId +
    `" } }
          url2: "` +
    data.url2 +
    `"
        }
        where: { id: "` +
    data.id +
    `" }
      ) {
        id
      }
    }
  `;

  // Crear el combo
  const { updateCliente } = await request(MASTER_URL, mutation);

  const publishMutation =
    gql`
mutation PublishTipoProducto {
publishCliente(where: {id:"` +
    updateCliente.id +
    `"}) {
  id
}
}
`;
  // Publicar el combo
  await request(MASTER_URL, publishMutation);

  return updateCliente;
};

const updatePedido = async (data) => {
  const mutation =
    gql`
    mutation UpdatePedido {
      updatePedido(
        data: {
          productoCantidad: {
            create: { producto: { connect: { id: "` +
    data.producto.id +
    `" } }, cantidad: ` +
    data.producto.cantidad +
    ` }
          }
        }
        where: { id: "` +
    data.id +
    `" }
      ) {
        id
        productoCantidad{
          id
        }
      }
    }
  `;

  // Crear el combo
  const { updatePedido } = await request(MASTER_URL, mutation);
  console.log(updatePedido);

  const publishMutation =
    gql`
mutation PublishPorductoCantidad {
publishProductoCantidad(where: {id:"` +
    updatePedido.productoCantidad[updatePedido.productoCantidad.length - 1].id +
    `"}) {
  id
}
}
`;
  // Publicar el combo
  await request(MASTER_URL, publishMutation);

  //Publicar Pedido
  const publishMutationPedido =
    gql`
mutation PublishPorductoCantidad {
publishPedido(where: {id:"` +
    updatePedido.id +
    `"}) {
  id
}
}
`;
  // Publicar el combo
  await request(MASTER_URL, publishMutationPedido);

  const pagoData = {
    pedidoId: updatePedido.id,
    tipoPagoId: data.tipoPagoId
  };

  console.log(pagoData)

  await createPagoPedido(pagoData);

  return updatePedido;
};

const createPagoPedido = async ({ pedidoId, tipoPagoId }) => {
  const mutation = gql`
    mutation CreatePagoPedido($pedidoId: ID!, $tipoPagoId: ID!) {
      createPago(
        data: {
          pedido: { connect: { id: $pedidoId } }
          tipoPago: { connect: { id: $tipoPagoId } }
        }
      ) {
        id
      }
    }
  `;

  const { createPago } = await request(MASTER_URL, mutation, {
    pedidoId,
    tipoPagoId,
  });

  const publishMutation = gql`
    mutation PublishPagoPedido($id: ID!) {
      publishPago(where: { id: $id }) {
        id
      }
    }
  `;
  await request(MASTER_URL, publishMutation, { id: createPago.id });
};


const createPedido = async (pedidoData) => {
  // 1. Crear el pedido
  const createQuery = gql`
    mutation {
    createPedido(
      data: {
        aprendice: { connect: { id: "${pedidoData?.persona?.id}" } }
        producto: {
          connect: [
            ${pedidoData.combos
              .map((combo) => `{ id: "${combo.id}" }`)
              .join(",")}
          ]
        }
        fecha: "${pedidoData?.fecha}"
      }
    ) {
      id
    }
  }
  `;
  console.log(createQuery);

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
        url2
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const getTipoPagos = async () => {
  const query = gql`
    query GetTipoPagos {
      tipoPagos {
        id
        tipoPago
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};



const GetCliente = async (id) => {
  const query =
    gql`
    query GetCliente {
      cliente(where: { id: "` +
    id +
    `" }) {
        id
        foto {
          url
        }
        url2
        nombre
        tieneValera
        tipoCliente {
          nombre
        }
        documento
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const GetCombo = async (id) => {
  const query =
    gql`
    query GetProducto {
      producto(where: { id: "` +
    id +
    `" }) {
        id
        nombre
        imagen {
          url
        }
        url2
        tipoProducto {
          nombre
          precio
        }
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const DeleteClient = async (id) => {
  console.log(id);

  const mutation =
    gql`
    mutation DeleteCliente {
      deleteCliente(where: { id: "` +
    id +
    `" }) {
        id
      }
    }
  `;

  console.log(mutation);

  try {
    const result = await request(
      MASTER_URL,
      mutation,
      {},
      {
        Authorization: `Bearer ${HYGRAPH_TOKEN}`,
      }
    );
    return result;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

const DeleteCombo = async (id) => {
  console.log(id);

  const mutation =
    gql`
    mutation DeleteCombo {
      deleteProducto(where: { id: "` +
    id +
    `" }) {
        id
      }
    }
  `;

  console.log(mutation);

  try {
    const result = await request(
      MASTER_URL,
      mutation,
      {},
      {
        Authorization: `Bearer ${HYGRAPH_TOKEN}`,
      }
    );
    return result;
  } catch (error) {
    console.error("Error deleting combo:", error);
    throw error;
  }
};

export default {
  GetAprendices,
  getProductos,
  createClient,
  GetTipoClientes,
  createPedido,
  GetPedidos,
  uploadAsset,
  GetCliente,
  GetTipoProductos,
  createCombo,
  GetCombo,
  updateClient,
  DeleteClient,
  DeleteCombo,
  createTipoProducto,
  updateCombo,
  updatePedido,
  getTipoPagos,
};
