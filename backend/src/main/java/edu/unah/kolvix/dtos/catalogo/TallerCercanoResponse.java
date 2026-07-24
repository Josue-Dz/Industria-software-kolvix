package edu.unah.kolvix.dtos.catalogo;

import edu.unah.kolvix.dtos.marketplace.PerfilMarketplaceResponse;

public record TallerCercanoResponse(
    PerfilMarketplaceResponse perfil,
    Double distanciaKm
){
    

}
